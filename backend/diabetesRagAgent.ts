import { StateGraph, CompiledStateGraph, START, END } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { formatDocumentsAsString } from "langchain/util/document";
import { getApiKey } from "./utils/env";
import logger from "./utils/logger";

// Define our state interface for the agent
export interface DiabetesQnAState {
  question: string;
  category?: "glucose" | "medication" | "meal" | "wellness" | "general";
  relevantDocs?: string;
  needsMoreInfo: boolean;
  answer?: string;
  followupQuestions?: string[];
  conversationHistory?: Array<{ role: string; content: string }>;
}

// Document sources by category
const DOCUMENT_SOURCES = {
  glucose: [
    "https://www.cdc.gov/diabetes/managing/managing-blood-sugar.html",
    "https://www.diabetes.org/healthy-living/medication-treatments/blood-glucose-testing-and-control",
    "https://www.niddk.nih.gov/health-information/diabetes/overview/managing-diabetes/know-blood-sugar-numbers"
  ],
  medication: [
    "https://www.diabetes.org/healthy-living/medication-treatments",
    "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments",
    "https://www.cdc.gov/diabetes/managing/medication.html"
  ],
  meal: [
    "https://www.diabetes.org/healthy-living/recipes-nutrition",
    "https://www.cdc.gov/diabetes/managing/eat-well.html",
    "https://www.niddk.nih.gov/health-information/diabetes/overview/diet-eating-physical-activity"
  ],
  wellness: [
    "https://www.diabetes.org/healthy-living/mental-health",
    "https://www.cdc.gov/diabetes/managing/mental-health.html",
    "https://www.niddk.nih.gov/health-information/diabetes/overview/preventing-problems"
  ],
  general: [
    "https://www.diabetes.org/diabetes",
    "https://www.cdc.gov/diabetes/basics/type2.html",
    "https://www.niddk.nih.gov/health-information/diabetes/overview"
  ]
};

/**
 * Class for the Diabetes RAG Agent that handles patient questions
 */
export class DiabetesRagAgent {
  private vectorStores: Record<string, any> = {};
  private model: ChatGoogleGenerativeAI;
  private embeddings: GoogleGenerativeAIEmbeddings;
  private graph: StateGraph<DiabetesQnAState>;
  private executor: any;
  private isInitialized: boolean = false;

  constructor() {
    const API_KEY = getApiKey("GEMINI_API_KEY");

    this.model = new ChatGoogleGenerativeAI({
      apiKey: API_KEY,
      model: "gemini-pro",
      maxOutputTokens: 2048,
    });

    this.embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: API_KEY,
      modelName: "embedding-001",
    });

    this.graph = new StateGraph<DiabetesQnAState>({
      channels: {
        question: null,
        category: null,
        relevantDocs: null,
        needsMoreInfo: null,
        answer: null,
        followupQuestions: null,
        conversationHistory: null
      },
    });
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      logger.info("Initializing Diabetes RAG Agent");
      await this.setupVectorStores();
      this.setupGraph();
      this.executor = this.graph.compile();
      this.isInitialized = true;
      logger.info("Diabetes RAG Agent successfully initialized");
    } catch (error) {
      logger.error("Failed to initialize Diabetes RAG Agent", { error });
      throw new Error(`Failed to initialize RAG system: ${error}`);
    }
  }

  private async setupVectorStores(): Promise<void> {
    const categories = ["glucose", "medication", "meal", "wellness", "general"] as const;

    for (const category of categories) {
      try {
        const webLoaders = DOCUMENT_SOURCES[category].map(
          (source) =>
            new CheerioWebBaseLoader(source, {
              selector: "main, article, .content, .article-content, #content, body",
            })
        );

        const docs = [];
        for (const loader of webLoaders) {
          try {
            const loadedDocs = await loader.load();
            docs.push(...loadedDocs);
          } catch (err) {
            logger.warn(`Failed to load a document source, skipping: ${err}`);
          }
        }

        const textSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: 1000,
          chunkOverlap: 200,
        });

        const splitDocs = await textSplitter.splitDocuments(docs);

        this.vectorStores[category] = await MemoryVectorStore.fromDocuments(splitDocs, this.embeddings);

        logger.info(`Processed ${splitDocs.length} document chunks for category: ${category}`);
      } catch (error) {
        logger.error(`Error processing document category: ${category}`, { error });
        this.vectorStores[category] = new MemoryVectorStore(this.embeddings);
      }
    }
  }

  private setupGraph(): void {
    this.graph.addNode("categorize_question", async (state: DiabetesQnAState): Promise<Partial<DiabetesQnAState>> => {
      const response = await this.model.invoke([
        new SystemMessage(
          "You are an expert at categorizing diabetes-related questions. " +
          "Categorize the given question into one of these categories: " +
          "glucose (blood sugar management), medication (medications and treatments), " +
          "meal (nutrition and diet), wellness (emotional and mental health), " +
          "or general (general diabetes information). " +
          "Respond with only the category name in lowercase."
        ),
        new HumanMessage(state.question),
      ]);

      const category = response.content.toString().trim().toLowerCase();
      const validCategories = ["glucose", "medication", "meal", "wellness", "general"];

      return {
        ...state,
        category: validCategories.includes(category) ? (category as any) : "general",
      };
    });
    
    // Add retrieve_documents node
    this.graph.addNode("retrieve_documents", async (state: DiabetesQnAState): Promise<Partial<DiabetesQnAState>> => {
      // Default to general if no category is set
      const category = state.category || "general";
      
      // Get the vector store for the category
      const vectorStore = this.vectorStores[category];
      
      try {
        // Perform similarity search
        const docs = await vectorStore.similaritySearch(state.question, 3);
        const relevantDocs = formatDocumentsAsString(docs);
        
        return {
          ...state,
          relevantDocs,
        };
      } catch (error) {
        logger.error(`Error retrieving documents: ${error}`);
        return {
          ...state,
          relevantDocs: "",
          needsMoreInfo: true,
        };
      }
    });
    
    // Add check_info_sufficiency node
    this.graph.addNode("check_info_sufficiency", async (state: DiabetesQnAState): Promise<Partial<DiabetesQnAState>> => {
      const hasRelevantDocs = state.relevantDocs && state.relevantDocs.trim().length > 0;
      
      return {
        ...state,
        needsMoreInfo: !hasRelevantDocs,
      };
    });
    
    // Add request_more_info node
    this.graph.addNode("request_more_info", async (state: DiabetesQnAState): Promise<Partial<DiabetesQnAState>> => {
      return {
        ...state,
        answer: "I need more specific information to answer your question about diabetes. Could you provide more details?",
        followupQuestions: [
          "Can you be more specific about what you'd like to know?",
          "Are you asking about a particular aspect of diabetes management?",
          "Would you like information about blood sugar levels, medication, diet, or something else?"
        ]
      };
    });
    
    // Add generate_answer node
    this.graph.addNode("generate_answer", async (state: DiabetesQnAState): Promise<Partial<DiabetesQnAState>> => {
      const response = await this.model.invoke([
        new SystemMessage(
          "You are a helpful and accurate medical AI assistant for diabetes patients. " +
          "Use the provided context information to answer the question. " +
          "If you don't know the answer, say so rather than making something up. " +
          "Always mention that the patient should consult healthcare professionals for medical advice."
        ),
        new HumanMessage(
          `Context information: ${state.relevantDocs || "No specific information available."}\n\n` +
          `Question: ${state.question}\n\n` +
          `Answer the question based on the context provided.`
        )
      ]);
      
      return {
        ...state,
        answer: response.content.toString(),
      };
    });
    
    // Add generate_followups node
    this.graph.addNode("generate_followups", async (state: DiabetesQnAState): Promise<Partial<DiabetesQnAState>> => {
      if (!state.answer) return { ...state, followupQuestions: [] };
      
      const response = await this.model.invoke([
        new SystemMessage(
          "Based on the user's question and your answer, suggest 3 natural follow-up questions they might want to ask. " +
          "These should be directly related to diabetes management and relevant to the previous conversation."
        ),
        new HumanMessage(
          `User question: ${state.question}\n` +
          `Your answer: ${state.answer}\n` +
          `Generate 3 potential follow-up questions:`
        )
      ]);
      
      // Parse the response to extract the follow-up questions
      const content = response.content.toString();
      const questions = content
        .split(/\d+[\.\)]\s+/)  // Split by numbered list (1. or 1) format)
        .slice(1)  // Remove the first empty item
        .map(q => q.trim())
        .filter(q => q.length > 0);
      
      return {
        ...state,
        followupQuestions: questions.length > 0 ? questions : [
          "What are the common symptoms of diabetes?",
          "How can I monitor my blood sugar at home?",
          "What lifestyle changes can help manage diabetes?"
        ],
      };
    });
    
    // Connect the nodes in the graph
    this.graph.addEdge(START, "categorize_question");
    this.graph.addEdge("categorize_question", "retrieve_documents");
    this.graph.addEdge("retrieve_documents", "check_info_sufficiency");
    this.graph.addConditionalEdges(
      "check_info_sufficiency",
      (state) => (state.needsMoreInfo ? "request_more_info" : "generate_answer")
    );
    this.graph.addEdge("generate_answer", "generate_followups");
    this.graph.addEdge("generate_followups", END);
    this.graph.addEdge("request_more_info", END);
  }

  public async answerQuestion(
    question: string,
    category?: "glucose" | "medication" | "meal" | "wellness",
    conversationHistory?: Array<{ role: string; content: string }>
  ): Promise<{ answer: string; followupQuestions: string[] }> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const initialState: DiabetesQnAState = {
      question,
      category,
      needsMoreInfo: false,
      conversationHistory,
    };

    const finalState = await this.executor.invoke(initialState);

    return {
      answer: finalState.answer || "I'm sorry, I couldn't generate an answer at this time.",
      followupQuestions: finalState.followupQuestions || [],
    };
  }
}

export const diabetesRagAgent = new DiabetesRagAgent();