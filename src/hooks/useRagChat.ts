import { useState, useCallback, useEffect } from "react";
import axios from "axios";

// Types for the chat messages
export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: Date;
  type?: "text" | "voice" | "check-in" | "alert" | "nudge";
  context?: {
    options?: string[];
    [key: string]: any;
  };
}

// Hook params
interface UseRagChatParams {
  initialMessages?: ChatMessage[];
  topic?: "glucose" | "medication" | "meal" | "wellness";
  sessionId?: string;
}

export function useRagChat({
  initialMessages = [],
  topic,
  sessionId = "default",
}: UseRagChatParams = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [followupQuestions, setFollowupQuestions] = useState<string[]>([]);

  // Send a user message to the backend
  const sendMessage = useCallback(
    async (content: string, messageType: "text" | "voice" = "text") => {
      if (!content.trim()) return;

      // Add user message
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content,
        timestamp: new Date(),
        type: messageType,
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        // Make API call to the backend
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
        const response = await axios.post(`${backendUrl}/api/answerQuestion`, {
          question: content,
          category: topic,
          conversationHistory: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        });

        const result = response.data;

        // Add assistant response
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: result.answer,
          timestamp: new Date(),
          type: "text",
          context: {
            options: result.followupQuestions,
          },
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setFollowupQuestions(result.followupQuestions);
      } catch (error) {
        console.error("Error sending message to backend", error);

        // Add error message
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "I'm sorry, I encountered an error processing your request. Please try again or ask a different question.",
          timestamp: new Date(),
          type: "text",
        };

        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [topic, sessionId, messages]
  );

  // Clear all messages from the chat
  const clearMessages = useCallback(() => {
    setMessages([]);
    setFollowupQuestions([]);
  }, []);

  // Add a system message (like notifications or status updates)
  const addSystemMessage = useCallback(
    (content: string, messageType: "text" | "check-in" | "alert" | "nudge" = "text") => {
      const systemMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "system",
        content,
        timestamp: new Date(),
        type: messageType,
      };

      setMessages((prev) => [...prev, systemMessage]);
    },
    []
  );

  return {
    messages,
    isLoading,
    followupQuestions,
    sendMessage,
    clearMessages,
    addSystemMessage,
  };
}