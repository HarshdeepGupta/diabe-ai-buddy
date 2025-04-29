import { StateGraph, CompiledStateGraph, START, END} from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";
import { getApiKey } from "@/utils/env";
import logger from "@/utils/logger";

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

// Local medical documents for offline use
const LOCAL_DOCUMENTS = [
  "/documents/diabetes-overview.txt",
  "/documents/blood-sugar-management.txt",
  "/documents/medication-guide.txt",
  "/documents/nutrition-guide.txt",
  "/documents/emotional-wellbeing.txt"
];

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
    // Initialize the model with the API key
    const API_KEY = getApiKey("GEMINI_API_KEY");
    
    this.model = new ChatGoogleGenerativeAI({
      apiKey: API_KEY,
      model: "gemini-pro", // Using a capable model for complex reasoning
      maxOutputTokens: 2048,
    });
    
    this.embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: API_KEY,
      modelName: "embedding-001"
    });
    
    // Create the graph structure
    // Create the graph structure with explicit channels for each state property
    this.graph = new StateGraph<DiabetesQnAState>({
        channels: {
          // For each key in DiabetesQnAState, define how updates are merged.
          // 'null' (or omitting) means the new value replaces the old one.
          question: null,
          category: null,
          relevantDocs: null,
          needsMoreInfo: null,
          answer: null,
          followupQuestions: null,
          conversationHistory: null,
          // If you had a property like 'errorMessages' that multiple nodes
          // could add to, you might use "__add__" or a custom reducer:
          // errorMessages: {
          //   value: (x: string[], y: string[]) => x.concat(y), // Custom reducer to combine arrays
          //   default: () => [], // Default value if not set
          // },
        },
      });
  }
  
  /**
   * Initialize the RAG system by loading and processing documents
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      logger.info("Initializing Diabetes RAG Agent");
      
      // Set up vector stores for each category
      await this.setupVectorStores();
      
      // Add nodes to the graph
      this.setupGraph();
      
      // Compile the graph to create the executor
      this.executor = this.graph.compile();
      
      this.isInitialized = true;
      logger.info("Diabetes RAG Agent successfully initialized");
    } catch (error) {
      logger.error("Failed to initialize Diabetes RAG Agent", { error });
      throw new Error(`Failed to initialize RAG system: ${error}`);
    }
  }
  
  /**
   * Load and process documents to create vector stores
   */
  private async setupVectorStores(): Promise<void> {
    // Process each category
    const categories = ['glucose', 'medication', 'meal', 'wellness', 'general'] as const;
    
    for (const category of categories) {
      try {
        // Load online sources
        const webLoaders = DOCUMENT_SOURCES[category].map(source => 
          new CheerioWebBaseLoader(source, {
            selector: "main, article, .content, .article-content, #content, body"
          })
        );
        
        // Try to load local documents as fallback
        const textLoaders: TextLoader[] = [];
        try {
          textLoaders.push(...LOCAL_DOCUMENTS.map(path => new TextLoader(path)));
        } catch (err) {
          logger.warn("Could not load local documents, continuing with online sources only");
        }
        
        // Load all documents
        const docs = [];
        for (const loader of [...webLoaders, ...textLoaders]) {
          try {
            const loadedDocs = await loader.load();
            docs.push(...loadedDocs);
          } catch (err) {
            logger.warn(`Failed to load a document source, skipping: ${err}`);
          }
        }
        
        // Split documents into chunks
        const textSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: 1000,
          chunkOverlap: 200
        });
        
        const splitDocs = await textSplitter.splitDocuments(docs);
        
        // Create vector store from documents
        this.vectorStores[category] = await MemoryVectorStore.fromDocuments(
          splitDocs, 
          this.embeddings
        );
        
        logger.info(`Processed ${splitDocs.length} document chunks for category: ${category}`);
      } catch (error) {
        logger.error(`Error processing document category: ${category}`, { error });
        // Create empty vector store as fallback
        this.vectorStores[category] = new MemoryVectorStore(this.embeddings);
      }
    }
  }
  
  /**
   * Set up the agentic graph with all the nodes and edges
   */
  private setupGraph(): void {

    
    // Node 1: Categorize the question
    this.graph.addNode("categorize_question", async (state: DiabetesQnAState) => {
      const response = await this.model.invoke([
        new SystemMessage(
          "You are an expert at categorizing diabetes-related questions. " +
          "Categorize the given question into one of these categories: " +
          "glucose (blood sugar management), medication (medications and treatments), " +
          "meal (nutrition and diet), wellness (emotional and mental health), " +
          "or general (general diabetes information). " +
          "Respond with only the category name in lowercase."
        ),
        new HumanMessage(state.question)
      ]);
    
      const category = response.content.toString().trim().toLowerCase();
      const validCategories = ["glucose", "medication", "meal", "wellness", "general"];
      
      return { 
        ...state, 
        category: validCategories.includes(category) 
          ? category as any
          : "general"
      };
    });
    
    // Node 2: Retrieve relevant documents
    this.graph.addNode("retrieve_documents", async (state: DiabetesQnAState) => {
      // Default to general if category is not set
      const category = state.category || "general";
      
      // Get retriever for the category
      const retriever = this.vectorStores[category].asRetriever({
        searchType: "similarity",
        k: 4 // Retrieve top 4 relevant documents
      });
      
      // Retrieve documents
      const retrievalChain = RunnableSequence.from([
        (input: { question: string }) => input.question,
        retriever,
        formatDocumentsAsString
      ]);
      
      const relevantDocs = await retrievalChain.invoke({ question: state.question });
      
      return { ...state, relevantDocs };
    });
    
    // Node 3: Check if we need more information
    this.graph.addNode("check_info_sufficiency", async (state: DiabetesQnAState) => {
      const response = await this.model.invoke([
        new SystemMessage(
          "You are a medical assessment AI assistant specialized in diabetes. " +
          "Your job is to determine if there is enough information to answer a diabetes-related question accurately. " +
          "Respond with only YES or NO."
        ),
        new HumanMessage(
          `Question: ${state.question}\n\nAvailable information: ${state.relevantDocs}\n\n` +
          `Is there enough information to answer this question accurately? Answer with YES or NO only.`
        )
      ]);
      
      const answer = response.content.toString().trim().toUpperCase();
      const needsMoreInfo = answer === "NO";
      
      return { ...state, needsMoreInfo };
    });
    
    // Node 4: Request more information if needed
    this.graph.addNode("request_more_info", async (state: DiabetesQnAState) => {
      const response = await this.model.invoke([
        new SystemMessage(
          "You are a medical AI assistant helping a diabetes patient. " +
          "The patient has asked a question, but you need more information to provide an accurate answer. " +
          "Formulate a response asking for specific additional information."
        ),
        new HumanMessage(
          `Patient question: ${state.question}\n\nAvailable information: ${state.relevantDocs}\n\n` +
          `What specific additional information do you need from the patient to answer their question accurately? ` +
          `Frame this as a helpful response.`
        )
      ]);
      
      return { 
        ...state, 
        answer: response.content.toString(),
        followupQuestions: ["Could you provide more details?"]
      };
    });
    
    // Node 5: Generate answer based on relevant documents
    this.graph.addNode("generate_answer", async (state: DiabetesQnAState) => {
      const history = state.conversationHistory || [];
      
      const response = await this.model.invoke([
        new SystemMessage(
          "You are a helpful and accurate medical AI assistant for diabetes patients. " +
          "Use ONLY the provided context to answer the question. " +
          "If the context doesn't contain the answer, admit that you don't have enough information. " +
          "Always prioritize accuracy over comprehensiveness. " +
          "Always mention that the patient should consult healthcare professionals for medical advice. " +
          "Use bullet points to make complex information more readable when appropriate. " +
          "Avoid medical jargon when possible and explain terms when necessary."
        ),
        ...history.map(msg => {
          if (msg.role === 'user') {
            return new HumanMessage(msg.content);
          } else {
            return new SystemMessage(msg.content);
          }
        }),
        new HumanMessage(
          `Context information: ${state.relevantDocs}\n\nQuestion: ${state.question}\n\n` +
          `Answer the question based only on the context provided.`
        )
      ]);
      
      return { 
        ...state, 
        answer: response.content.toString() 
      };
    });
    
    // Node 6: Generate follow-up questions
    this.graph.addNode("generate_followups", async (state: DiabetesQnAState) => {
      if (!state.answer) return state;
      
      const response = await this.model.invoke([
        new SystemMessage(
          "You are a medical AI assistant. Based on the patient's question and your answer, " +
          "generate 3 potential follow-up questions the patient might want to ask. " +
          "These should be directly related to diabetes management and relevant to the previous conversation. " +
          "Format them as a numbered list (1., 2., 3.)."
        ),
        new HumanMessage(
          `Patient question: ${state.question}\nYour answer: ${state.answer}\n` +
          `Generate 3 potential follow-up questions:`
        )
      ]);
      
      // Parse the follow-up questions from the response
      const content = response.content.toString();
      const followupQuestions = content
        .split(/\d+\./)
        .slice(1)
        .map(q => q.trim())
        .filter(q => q.length > 0);
      
      // Update conversation history
      const updatedHistory = [
        ...(state.conversationHistory || []),
        { role: 'user', content: state.question },
        { role: 'assistant', content: state.answer }
      ];
      
      return { 
        ...state, 
        followupQuestions,
        conversationHistory: updatedHistory
      };
    });
    
    // Define the edges/transitions between nodes
    /*
    this.graph.addEdge(START, "categorize_question");
    this.graph.addEdge("categorize_question", "retrieve_documents");
    this.graph.addEdge("retrieve_documents", "check_info_sufficiency");
    
    // Add conditional edges based on whether we need more info
    this.graph.addConditionalEdges(
      "check_info_sufficiency",
      (state) => state.needsMoreInfo,
      [
        { value: true, node: "request_more_info" },
        { value: false, node: "generate_answer" }
      ]
    );
    
    // Connect the final nodes
    this.graph.addEdge("generate_answer", "generate_followups");

    // Connect the terminal nodes to END
    this.graph.addEdge("generate_followups", END); // Path ends after generating follow-ups
    this.graph.addEdge("request_more_info", END);  // Path ends after requesting more info
   */
  }
  
  /**
   * Process a new question from the patient
   * @param question The patient's question
   * @param category Optional category to focus the search
   * @param conversationHistory Optional conversation history for context
   * @returns The answer and follow-up questions
   */
  public async answerQuestion(
    question: string, 
    category?: "glucose" | "medication" | "meal" | "wellness",
    conversationHistory?: Array<{ role: string; content: string }>
  ): Promise<{
    answer: string;
    followupQuestions: string[];
  }> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    try {
      const result = await this.executor.invoke({
        question,
        category,
        needsMoreInfo: false,
        conversationHistory
      });
      
      return {
        answer: result.answer || "I'm sorry, I couldn't generate an answer at this time.",
        followupQuestions: result.followupQuestions || []
      };
    } catch (error) {
      logger.error("Error processing question with RAG agent", { error, question });
      return {
        answer: "I'm sorry, I encountered an error while processing your question. Please try again or ask in a different way.",
        followupQuestions: ["Could you rephrase your question?", "Would you like to ask about a different topic?"]
      };
    }
  }
}

// Export a singleton instance
export const diabetesRagAgent = new DiabetesRagAgent();