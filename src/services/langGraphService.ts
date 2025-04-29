
import { API_CONFIG, getApiKey, isLangGraphEnabled } from "@/utils/env";
import { toast } from "@/components/ui/use-toast";

/**
 * Types for the LangGraph service
 */
export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: Date;
};

export type AgentAction = {
  type: string;
  payload: any;
};

export type ChatResponse = {
  message: ChatMessage;
  actions?: AgentAction[];
  metadata?: {
    reasoning?: string;
    category?: string;
    confidence?: number;
    sources?: string[];
  };
};

/**
 * Service for interacting with the LangGraph backend
 */
export const langGraphService = {
  /**
   * Check if the backend service is available
   */
  async checkStatus(): Promise<boolean> {
    if (!isLangGraphEnabled()) {
      return false;
    }
    
    try {
      const response = await fetch(API_CONFIG.langGraph.statusEndpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Backend service is not available");
      }
      
      return true;
    } catch (error) {
      console.error("LangGraph backend status check failed:", error);
      return false;
    }
  },
  
  /**
   * Send a message to the chat agent
   * @param messages - The conversation history
   * @param userContext - Additional user context (profile, health data, etc.)
   */
  async sendMessage(
    messages: ChatMessage[], 
    userContext?: any
  ): Promise<ChatResponse> {
    if (!isLangGraphEnabled()) {
      throw new Error("LangGraph is not enabled. Please set VITE_USE_LANGGRAPH=true in your .env file.");
    }
    
    try {
      const response = await fetch(API_CONFIG.langGraph.chatEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages,
          userContext
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to get response from agent");
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error sending message to LangGraph agent:", error);
      toast({
        title: "Communication Error",
        description: "Could not connect to the AI assistant. Please try again later.",
        variant: "destructive",
      });
      
      // Return fallback response
      return {
        message: {
          role: "assistant",
          content: "I'm having trouble connecting to my services right now. Please try again in a moment.",
          timestamp: new Date(),
        },
      };
    }
  },
  
  /**
   * Process a voice message
   * @param audioBlob - The audio recording as a Blob
   * @param messages - The conversation history for context
   */
  async processVoiceMessage(
    audioBlob: Blob, 
    messages: ChatMessage[]
  ): Promise<ChatResponse> {
    if (!isLangGraphEnabled()) {
      throw new Error("LangGraph is not enabled. Please set VITE_USE_LANGGRAPH=true in your .env file.");
    }
    
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob);
      formData.append("messages", JSON.stringify(messages));
      
      const response = await fetch(API_CONFIG.langGraph.voiceChatEndpoint, {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to process voice message");
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error processing voice message:", error);
      toast({
        title: "Voice Processing Error",
        description: "Could not process your voice message. Please try typing instead.",
        variant: "destructive",
      });
      
      // Return fallback response
      return {
        message: {
          role: "assistant",
          content: "I couldn't understand the audio. Could you try typing your message instead?",
          timestamp: new Date(),
        },
      };
    }
  },
};

/**
 * Hook for using the LangGraph agent in components
 */
export function useLangGraphAgent() {
  // You can expand this hook with React state management as needed
  return {
    sendMessage: langGraphService.sendMessage,
    processVoiceMessage: langGraphService.processVoiceMessage,
    checkStatus: langGraphService.checkStatus,
    isEnabled: isLangGraphEnabled(),
  };
}
