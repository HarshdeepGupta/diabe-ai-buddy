import os
import csv
import re
import logging
import requests
import numpy as np
from typing import Optional, List, Dict, Any
from dotenv import load_dotenv
from bs4 import BeautifulSoup
import google.generativeai as genai

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
    ]
}

_VALID_CATEGORIES = ["glucose", "medication", "meal", "wellness", "general"]


class SimpleVectorStore:
    """Lightweight in-memory vector store using cosine similarity."""

    def __init__(self):
        self._embeddings: List[np.ndarray] = []
        self._documents: List[str] = []

    def add_documents(self, documents: List[str], embeddings: List[np.ndarray]) -> None:
        self._documents.extend(documents)
        self._embeddings.extend(embeddings)

    def similarity_search(self, query_embedding: np.ndarray, k: int = 3) -> List[str]:
        if not self._embeddings:
            return []
        matrix = np.vstack(self._embeddings)
        # Normalise query
        q_norm = query_embedding / (np.linalg.norm(query_embedding) + 1e-10)
        # Normalise document embeddings row-wise
        norms = np.linalg.norm(matrix, axis=1, keepdims=True) + 1e-10
        scores = (matrix / norms) @ q_norm
        top_k = min(k, len(self._documents))
        indices = np.argsort(scores)[-top_k:][::-1]
        return [self._documents[i] for i in indices]


def _load_web_document(url: str) -> str:
    """Fetch a URL and return its plain-text content."""
    try:
        headers = {"User-Agent": "Mozilla/5.0 (compatible; DiabetesBot/1.0)"}
        response = requests.get(url, timeout=15, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        for tag in soup(["script", "style", "nav", "footer", "header"]):
            tag.decompose()
        text = soup.get_text(separator="\n", strip=True)
        return re.sub(r"\n{3,}", "\n\n", text)
    except Exception as exc:
        logger.warning("Failed to load %s: %s", url, exc)
        return ""


def _load_csv_document(path: str) -> str:
    """Read a CSV file and return its rows as plain text."""
    try:
        rows = []
        with open(path, newline="", encoding="utf-8") as fh:
            reader = csv.DictReader(fh)
            for row in reader:
                rows.append(", ".join(f"{k}: {v}" for k, v in row.items() if v))
        return "\n".join(rows)
    except Exception as exc:
        logger.warning("Failed to load CSV %s: %s", path, exc)
        return ""


def _split_text(text: str, chunk_size: int = 1000, chunk_overlap: int = 200) -> List[str]:
    """Split *text* into overlapping chunks of at most *chunk_size* characters."""
    chunks = []
    start = 0
    while start < len(text):
        chunks.append(text[start:start + chunk_size])
        start += chunk_size - chunk_overlap
    return [c for c in chunks if c.strip()]


class DiabetesRagAgent:
    """Pure-Python RAG agent for diabetes Q&A using Google Gemini directly."""

    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        genai.configure(api_key=api_key)
        self._model = genai.GenerativeModel("gemini-2.0-flash")
        self._vector_stores: Dict[str, SimpleVectorStore] = {}
        self.is_initialized = False

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def preload_documents(self) -> None:
        self._setup_vector_stores()
        self.is_initialized = True

    def answer_question(
        self,
        question: str,
        category: Optional[str] = None,
        conversation_history: Optional[List[Dict[str, str]]] = None,
    ) -> Dict[str, Any]:
        if not self.is_initialized:
            self.preload_documents()
        cat = self._categorize_question(question, category)
        context = self._retrieve_documents(question, cat)
        answer = self._generate_answer(question, context)
        followups = self._generate_followups(question, answer)
        return {
            "answer": answer or "I'm sorry, I couldn't generate an answer at this time.",
            "followupQuestions": followups,
        }

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _embed_text(self, text: str, task_type: str = "retrieval_document") -> np.ndarray:
        result = genai.embed_content(
            model="models/embedding-001",
            content=text,
            task_type=task_type,
        )
        return np.array(result["embedding"])

    def _setup_vector_stores(self) -> None:
        for category in _VALID_CATEGORIES:
            store = SimpleVectorStore()
            try:
                raw_texts: List[str] = []
                for source in DOCUMENT_SOURCES[category]:
                    if source.endswith(".csv"):
                        logger.info("Loading CSV: %s", source)
                        text = _load_csv_document(source)
                    else:
                        text = _load_web_document(source)
                    if text:
                        raw_texts.append(text)
                        logger.info("✅ Loaded %s (category: %s)", source, category)
                    else:
                        logger.warning("No content from %s", source)

                if not raw_texts:
                    logger.warning("No documents for category: %s", category)
                    self._vector_stores[category] = store
                    continue

                chunks = []
                for text in raw_texts:
                    chunks.extend(_split_text(text))

                if not chunks:
                    logger.warning("No chunks for category: %s", category)
                    self._vector_stores[category] = store
                    continue

                embeddings = [self._embed_text(c) for c in chunks]
                store.add_documents(chunks, embeddings)
                logger.info("Stored %d chunks for category: %s", len(chunks), category)
            except Exception as exc:
                logger.error("Error processing category %s: %s", category, exc)
            self._vector_stores[category] = store

    def _categorize_question(self, question: str, category: Optional[str]) -> str:
        if category and category in _VALID_CATEGORIES:
            logger.info("Skipping categorization — category already set: %s", category)
            return category
        prompt = (
            "You are an expert at categorizing diabetes-related questions. "
            "Categorize the given question into one of these categories: "
            "glucose (blood sugar management), medication (medications and treatments), "
            "meal (nutrition and diet), wellness (emotional and mental health), "
            "or general (general diabetes information). "
            "Respond with only the category name in lowercase.\n\n"
            f"Question: {question}"
        )
        response = self._model.generate_content(prompt)
        cat = response.text.strip().lower()
        return cat if cat in _VALID_CATEGORIES else "general"

    def _retrieve_documents(self, question: str, category: str) -> str:
        store = self._vector_stores.get(category, SimpleVectorStore())
        try:
            query_embedding = self._embed_text(question, task_type="retrieval_query")
            docs = store.similarity_search(query_embedding, k=3)
            logger.info("Retrieved %d documents for category '%s'", len(docs), category)
            return "\n\n".join(docs)
        except Exception as exc:
            logger.error("Error retrieving documents: %s", exc)
            return ""

    def _generate_answer(self, question: str, context: str) -> str:
        prompt = (
            "You are a helpful and accurate medical AI assistant for diabetes patients. "
            "Use the provided context information to answer the question if it is relevant. "
            "If the context does not contain the answer, use your own knowledge to provide the most accurate and helpful response. "
            "Do not say 'I am sorry, but this document does not contain information about ...' or similar phrases. "
            "Always provide a helpful, informative answer, and mention that the patient should consult healthcare professionals for medical advice.\n\n"
            f"Context information: {context or 'No specific information available.'}\n\n"
            f"Question: {question}\n\n"
            "Answer the question based on the context provided, or your own knowledge if the context is insufficient."
        )
        response = self._model.generate_content(prompt)
        return response.text

    def _generate_followups(self, question: str, answer: str) -> List[str]:
        if not answer:
            return []
        prompt = (
            "Based on the user's question and your answer, suggest 1 natural follow-up question the user might want to ask. "
            "It should be directly related to diabetes management and relevant to the previous conversation. "
            "It must be a short question, no more than 10 words.\n\n"
            f"User question: {question}\n"
            f"Your answer: {answer}\n"
            "Generate 1 potential follow-up question:"
        )
        response = self._model.generate_content(prompt)
        content = response.text.replace("**", "")
        questions = [q.strip() for q in content.split("\n") if q.strip()]
        return questions if questions else []


rag_agent = DiabetesRagAgent()
