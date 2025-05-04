import os
import logging
from typing import Optional, List, Dict, Any
from dotenv import load_dotenv
from dataclasses import dataclass, field, asdict

# LangChain/LangGraph imports (adjust as needed for your environment)
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_community.document_loaders import WebBaseLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langgraph.graph import StateGraph, END, START
from uuid import uuid4
from langchain_community.document_loaders.csv_loader import CSVLoader
from langchain_community.document_loaders import PyPDFLoader

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

DOCUMENT_SOURCES = {
    "glucose": [
        "https://www.diabetes.org/healthy-living/medication-treatments/blood-glucose-testing-and-control",
        "https://www.niddk.nih.gov/health-information/diabetes/overview/managing-diabetes/know-blood-sugar-numbers"
    ],
    "medication": [
        "https://www.diabetes.org/healthy-living/medication-treatments",
        "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"
    ],
    "meal": [
        "https://diabetesjournals.org/care/article/40/Supplement_1/S33/36913/4-Lifestyle-Management",
        "https://www.niddk.nih.gov/health-information/diabetes/overview/diet-eating-physical-activity",
        "./backend_py/data/nutritiondata.csv"
    ],
    "wellness": [
        "https://www.diabetes.org/healthy-living/mental-health",
        "https://www.niddk.nih.gov/health-information/diabetes/overview/preventing-problems"
    ],
    "general": [
        "https://www.cdc.gov/diabetes/about/about-type-2-diabetes.html?CDC_AAref_Val=https://www.cdc.gov/diabetes/basics/type2.html",
        "https://www.niddk.nih.gov/health-information/diabetes/overview",
        #"./backend_py/data/medquad.csv",
    ]
}

def format_documents_as_string(docs):
    """
    Format a list of document objects as a single string for context.
    """
    return "\n\n".join(
        getattr(doc, "page_content", str(doc)) for doc in docs
    )
    
# Define the state schema as a dataclass
@dataclass
class agents_state_schema:
    """
    Schema for the agent's state.
    """
    question: str
    category: Optional[str] = None
    relevantDocs: Optional[str] = None
    answer: Optional[str] = None
    followupQuestions: Optional[List[str]] = field(default_factory=list)
    needsMoreInfo: bool = False
    conversationHistory: Optional[List[Dict[str, str]]] = None

class DiabetesRagAgent:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        os.environ["GOOGLE_API_KEY"] = api_key  # Correct way to set environment variable
        self.model = ChatGoogleGenerativeAI(
            api_key=api_key,
            model="gemini-2.0-flash",
            max_output_tokens=2048,
        )
        self.embeddings = GoogleGenerativeAIEmbeddings(
            google_api_key=api_key,
            model="models/embedding-001",
        )
        #self.embeddings = GoogleGenerativeAIEmbeddings(
        #    api_key=api_key,
        #    model="embedding-001",
        #)
        self.vector_stores: Dict[str, Any] = {}
        self.graph = StateGraph(agents_state_schema)
        self.executor = None
        self.is_initialized = False

    def preload_documents(self):
        self._setup_vector_stores()
        self._setup_graph()
        self.executor = self.graph.compile()
        self.is_initialized = True

    def _setup_vector_stores(self) -> None:
        """
        Build/refresh an in‑memory vector store for each category defined in
        DOCUMENT_SOURCES.  Mirrors the TypeScript `setupVectorStores` logic.
        """
        categories: List[str] = ["glucose", "medication", "meal",
                                "wellness", "general"]

        for category in categories:
            try:
                # 1) create loaders for every source in the category
                web_loaders = [
                    PyPDFLoader(source) if source.endswith(".pdf") else (
                        CSVLoader(source) if source.endswith(".csv") else WebBaseLoader(source)
                    )
                    for source in DOCUMENT_SOURCES[category]
                ]

                # 2) load the documents
                docs = []
                for source, loader in zip(DOCUMENT_SOURCES[category], web_loaders):
                    try:
                        if source.endswith(".csv"):
                            logger.info("Attempting to load CSV file: %s", source)
                        loaded_docs = loader.load()
                        if not loaded_docs:
                            logger.warning("No documents loaded from source: %s", source)
                            continue
                        docs.extend(loaded_docs)
                        logger.info(
                            "✅ Successfully Pre‑loaded %d pages from %s (category: %s)",
                            len(loaded_docs), source, category
                        )
                    except Exception as err:
                        logger.warning("Failed to load a document source, skipping: %s", err)
                        if source.endswith(".csv"):
                            logger.error("Error loading CSV file: %s. Please check the file format and content.", source)

                if not docs:
                    logger.warning("No documents available for category: %s", category)
                    self.vector_stores[category] = Chroma(
                        collection_name=f"empty_{category}_{uuid4().hex[:8]}",
                        embedding_function=self.embeddings,
                    )
                    logger.info("Created empty vector store for category: %s", category)
                    continue

                # 3) split into chunks
                splitter = RecursiveCharacterTextSplitter(
                    chunk_size=1000,
                    chunk_overlap=200,
                )
                split_docs = splitter.split_documents(docs)

                if not split_docs:
                    logger.warning("No document chunks created for category: %s", category)
                    self.vector_stores[category] = Chroma(
                        collection_name=f"empty_{category}_{uuid4().hex[:8]}",
                        embedding_function=self.embeddings,
                    )
                    logger.info("Created empty vector store for category: %s", category)
                    continue

                # 4) build the vector store for the category
                self.vector_stores[category] = Chroma.from_documents(
                    split_docs, self.embeddings
                )

                logger.info("Processed %d document chunks for category: %s",
                            len(split_docs), category)

            except Exception as error:
                logger.error("Error processing document category %s: %s",
                            category, error)
                # fall back to an empty store so similarity_search still works
                # self.vector_stores[category] = Chroma(self.embeddings)
                # create an empty chroma collection so similarity_search still works

                self.vector_stores[category] = Chroma(
                    collection_name=f"empty_{category}_{uuid4().hex[:8]}",
                    embedding_function=self.embeddings,
                )
                logger.info("Created empty vector store for category: %s", category)

    def _setup_graph(self):
        # Categorize question node
        def categorize_question(state: agents_state_schema) -> agents_state_schema:
            response = self.model.invoke([
                SystemMessage(
                    content=(
                        "You are an expert at categorizing diabetes-related questions. "
                        "Categorize the given question into one of these categories: "
                        "glucose (blood sugar management), medication (medications and treatments), "
                        "meal (nutrition and diet), wellness (emotional and mental health), "
                        "or general (general diabetes information). "
                        "Respond with only the category name in lowercase."
                    )
                ),
                HumanMessage(content=state.question),
            ])
            category = response.content.strip().lower()
            valid_categories = ["glucose", "medication", "meal", "wellness", "general"]
            state.category = category if category in valid_categories else "general"
            return state

        # Retrieve documents node
        def retrieve_documents(state: agents_state_schema) -> agents_state_schema:
            category = state.category or "general"
            vector_store = self.vector_stores.get(category)
            try:
                docs = vector_store.similarity_search(state.question, k=3)
                relevant_docs = format_documents_as_string(docs)
                state.relevantDocs = relevant_docs
                logger.info(f"Retrieved {len(docs)} documents for category '{category}'")
            except Exception as error:
                logger.error(f"Error retrieving documents: {error}")
                state.relevantDocs = ""
                state.needsMoreInfo = True
            return state

        # Generate answer node
        def generate_answer(state: agents_state_schema) -> agents_state_schema:
            response = self.model.invoke([
                SystemMessage(
                    content=(
                        "You are a helpful and accurate medical AI assistant for diabetes patients. "
                        "Use the provided context information to answer the question if it is relevant. "
                        "If the context does not contain the answer, use your own knowledge to provide the most accurate and helpful response. "
                        "Do not say 'I am sorry, but this document does not contain information about ...' or similar phrases. "
                        "Always provide a helpful, informative answer, and mention that the patient should consult healthcare professionals for medical advice."
                    )
                ),
                HumanMessage(
                    content=(
                        f"Context information: {state.relevantDocs or 'No specific information available.'}\n\n"
                        f"Question: {state.question}\n\n"
                        "Answer the question based on the context provided, or your own knowledge if the context is insufficient."
                    )
                )
            ])
            state.answer = response.content
            return state

        # Generate followups node
        def generate_followups(state: agents_state_schema) -> agents_state_schema:
            if not state.answer:
                state.followupQuestions = []
                return state
            response = self.model.invoke([
                SystemMessage(
                    content=(
                        "Based on the user's question and your answer, suggest 1 natural follow-up questions they might want to ask. "
                        "These should be directly related to diabetes management and relevant to the previous conversation and it must be a short question not more than 10 words. "
                    )
                ),
                HumanMessage(
                    content=(
                        f"User question: {state.question}\n"
                        f"Your answer: {state.answer}\n"
                        "Generate 1 potential follow-up question:"
                    )
                )
            ])
            content = response.content.replace("**", "")
            questions = [q.strip() for q in content.split('\n') if q.strip()]
            state.followupQuestions = questions if questions else []
            return state

        # Build the state graph
        self.graph.add_node("categorize_question", categorize_question)
        self.graph.add_node("retrieve_documents", retrieve_documents)
        self.graph.add_node("generate_answer", generate_answer)
        self.graph.add_node("generate_followups", generate_followups)
        self.graph.add_edge(START, "categorize_question")
        self.graph.add_edge("categorize_question", "retrieve_documents")
        self.graph.add_edge("retrieve_documents", "generate_answer")
        self.graph.add_edge("generate_answer", "generate_followups")
        self.graph.add_edge("generate_followups", END)

    def answer_question(
        self,
        question: str,
        category: Optional[str] = None,
        conversation_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        if not self.is_initialized:
            self.preload_documents()
        # Create state using dataclass
        state = agents_state_schema(
            question=question,
            category=category,
            needsMoreInfo=False,
            conversationHistory=conversation_history,
        )
        #logger.info(f"Initial state: {state}")
        final_state = self.executor.invoke(state)
        #logger.info(f"Final state returned by executor: {final_state} (type: {type(final_state)})")
        # If final_state is a dict, convert to dataclass
        if isinstance(final_state, dict):
            final_state = agents_state_schema(**final_state)
        # Convert dataclass to dict for output
        return {
            "answer": getattr(final_state, "answer", "I'm sorry, I couldn't generate an answer at this time."),
            "followupQuestions": getattr(final_state, "followupQuestions", []),
        }
