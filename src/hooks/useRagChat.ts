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
        const response = await axios.post("http://localhost:3001/api/answerQuestion", {
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
/*
import { useState } from "react";
import axios from "axios";

export function useRagChat({ topic, initialMessages = [] }: { topic?: string; initialMessages?: any[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [followupQuestions, setFollowupQuestions] = useState<string[]>([]);

  const sendMessage = async (message: string) => {
    setIsLoading(true);

    try {
      // Send the message to the backend API
      const response = await axios.post("http://localhost:3001/api/answerQuestion", {
        question: message,
        category: topic,
        conversationHistory: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      });

      // Update the messages with the user's message and the assistant's response
      setMessages((prev) => [
        ...prev,
        { role: "user", content: message, timestamp: new Date() },
        { role: "assistant", content: response.data.answer, timestamp: new Date() },
      ]);

      // Update follow-up questions if provided
      if (response.data.followupQuestions) {
        setFollowupQuestions(response.data.followupQuestions);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addSystemMessage = (content: string, type: string = "text") => {
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content, type, timestamp: new Date() },
    ]);
  };

  return {
    messages,
    isLoading,
    followupQuestions,
    sendMessage,
    addSystemMessage,
  };
}
*/

/*import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { ragService } from "@/services/ragService";
import { v4 as uuidv4 } from "uuid";

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
  sessionId = uuidv4()
}: UseRagChatParams = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [followupQuestions, setFollowupQuestions] = useState<string[]>([]);

  // Initialize the RAG service on mount
  useEffect(() => {
    ragService.initialize().catch(console.error);
    
    // Clean up conversation on unmount
    return () => {
      ragService.clearConversation(sessionId);
    };
  }, [sessionId]);

  
   //Send a user message to the RAG agent
   
  const sendMessage = useCallback(async (
    content: string, 
    messageType: "text" | "voice" = "text"
  ) => {
    if (!content.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
      type: messageType
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Process with RAG agent
      const result = await ragService.processQuestion(content, topic, sessionId);
      
      // Add assistant response
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: result.answer,
        timestamp: new Date(),
        type: "text",
        context: {
          options: result.followupQuestions
        }
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setFollowupQuestions(result.followupQuestions);
    } catch (error) {
      console.error("Error sending message to RAG agent", error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I encountered an error processing your request. Please try again or ask a different question.",
        timestamp: new Date(),
        type: "text"
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [topic, sessionId]);

  
   //Clear all messages from the chat
   
  const clearMessages = useCallback(() => {
    setMessages([]);
    setFollowupQuestions([]);
    ragService.clearConversation(sessionId);
  }, [sessionId]);


   * //Add a system message (like notifications or status updates)

  const addSystemMessage = useCallback((
    content: string,
    messageType: "text" | "check-in" | "alert" | "nudge" = "text"
  ) => {
    const systemMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "system",
      content,
      timestamp: new Date(),
      type: messageType
    };
    
    setMessages(prev => [...prev, systemMessage]);
  }, []);

  return {
    messages,
    isLoading,
    followupQuestions,
    sendMessage,
    clearMessages,
    addSystemMessage
  };
}

*/