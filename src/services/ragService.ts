import { diabetesRagAgent } from "@/agents/diabetesRagAgent";
import logger from "@/utils/logger";

// Store conversation histories by sessionId
const conversationHistories: Record<string, Array<{ role: string; content: string }>> = {};

/**
 * Service to handle interactions with the RAG-based agent
 */

export const ragService = {
  /**
   * Initialize the RAG agent at application startup
   */
  initialize: async (): Promise<void> => {
    try {
      await diabetesRagAgent.initialize();
    } catch (error) {
      logger.error("Failed to initialize RAG service", { error });
    }
  },

  /**
   * Process a question using the RAG agent
   * @param question The user's question
   * @param category The topic category (glucose, medication, meal, wellness)
   * @param sessionId Unique identifier for the conversation
   * @returns Answer and follow-up questions
   */
  processQuestion: async (
    question: string,
    category?: "glucose" | "medication" | "meal" | "wellness",
    sessionId: string = "default"
  ): Promise<{
    answer: string;
    followupQuestions: string[];
  }> => {
    try {
      // Get the conversation history for this session
      const history = conversationHistories[sessionId] || [];
      
      // Get answer from agent
      const result = await diabetesRagAgent.answerQuestion(question, category, history);
      
      // Update conversation history
      if (!conversationHistories[sessionId]) {
        conversationHistories[sessionId] = [];
      }
      
      conversationHistories[sessionId].push(
        { role: "user", content: question },
        { role: "assistant", content: result.answer }
      );
      
      // Trim conversation history if it gets too long (keep last 10 messages)
      if (conversationHistories[sessionId].length > 20) {
        conversationHistories[sessionId] = conversationHistories[sessionId].slice(-20);
      }
      
      return result;
    } catch (error) {
      logger.error("Error in RAG service", { error, question, category });
      return {
        answer: "I apologize, but I encountered an error processing your question. Please try again.",
        followupQuestions: ["Could you ask your question in a different way?"]
      };
    }
  },
  
  /**
   * Clear the conversation history for a specific session
   * @param sessionId The session ID to clear
   */
  clearConversation: (sessionId: string = "default"): void => {
    if (conversationHistories[sessionId]) {
      delete conversationHistories[sessionId];
    }
  }
};