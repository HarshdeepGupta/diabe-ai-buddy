import { useState, useRef, useEffect } from "react";
import { useLangGraphAgent, ChatMessage, ChatResponse } from "@/services/langGraphService";
import { toast } from "@/components/ui/use-toast";

export type MessageWithExtras = ChatMessage & {
  id: string;
  type?: "text" | "voice" | "check-in" | "alert" | "nudge";
  context?: {
    category?: "medication" | "glucose" | "meal" | "activity" | "mood" | "emergency";
    actionable?: boolean;
    options?: string[];
    mood?: "neutral" | "concerned" | "encouraging" | "urgent" | "supportive" | "coaching";
    relatedData?: any;
  };
};

interface UseAgentChatOptions {
  initialMessages?: MessageWithExtras[];
  userContext?: any;
  onResponse?: (response: ChatResponse) => void;
  fallbackToSimulation?: boolean;
}

export function useAgentChat({
  initialMessages = [],
  userContext,
  onResponse,
  fallbackToSimulation = true,
}: UseAgentChatOptions = {}) {
  const [messages, setMessages] = useState<MessageWithExtras[]>(initialMessages);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { sendMessage, processVoiceMessage, isEnabled } = useLangGraphAgent();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const addMessage = (message: Omit<MessageWithExtras, "id" | "timestamp">) => {
    const fullMessage: MessageWithExtras = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, fullMessage]);
    return fullMessage;
  };
  
  // Function to send a text message
  const sendTextMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message to the chat
    const userMessage = addMessage({
      role: "user",
      content,
      type: "text",
    });
    
    setIsProcessing(true);
    setError(null);
    
    try {
      if (isEnabled) {
        // Use LangGraph agent if enabled
        const simplifiedMessages = messages.map(({ role, content }) => ({ 
          role, 
          content 
        })) as ChatMessage[];
        
        // Add the new user message to the messages for the API call
        const messagesForApi = [...simplifiedMessages, { 
          role: userMessage.role, 
          content: userMessage.content 
        }];
        
        const response = await sendMessage(messagesForApi, userContext);
        
        // Process the response
        const assistantMessage: MessageWithExtras = {
          id: Date.now().toString(),
          role: "assistant",
          content: response.message.content,
          timestamp: new Date(),
          type: detectMessageType(response),
          context: extractContext(response),
        };
        
        setMessages((prev) => [...prev, assistantMessage]);
        
        if (onResponse) {
          onResponse(response);
        }
      } else if (fallbackToSimulation) {
        // Fallback to simulated response if LangGraph is not enabled
        simulateResponse(content);
      } else {
        // If no fallback and LangGraph not enabled, show error
        toast({
          title: "LangGraph Not Enabled",
          description: "Please enable LangGraph in your .env file to use the AI assistant.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err instanceof Error ? err.message : "Failed to send message");
      
      // Add error message to chat
      addMessage({
        role: "system",
        content: "Sorry, there was an error processing your message. Please try again.",
        type: "alert",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Function to send a voice message
  const sendVoiceMessage = async (audioBlob: Blob) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      if (isEnabled) {
        // Use LangGraph agent if enabled
        const simplifiedMessages = messages.map(({ role, content }) => ({ 
          role, 
          content 
        })) as ChatMessage[];
        
        const response = await processVoiceMessage(audioBlob, simplifiedMessages);
        
        // Add transcribed user message
        const userMessage = addMessage({
          role: "user",
          content: response.message.content, // Use the transcribed content
          type: "voice",
        });
        
        // Process the assistant response
        const assistantMessage: MessageWithExtras = {
          id: Date.now().toString(),
          role: "assistant",
          content: response.message.content,
          timestamp: new Date(),
          type: detectMessageType(response),
          context: extractContext(response),
        };
        
        setMessages((prev) => [...prev, assistantMessage]);
        
        if (onResponse) {
          onResponse(response);
        }
      } else if (fallbackToSimulation) {
        // Fallback to simulated response if LangGraph is not enabled
        const recognizedText = "This is a simulated voice message transcription.";
        
        // Add user message with transcription
        const userMessage = addMessage({
          role: "user",
          content: recognizedText,
          type: "voice",
        });
        
        simulateResponse(recognizedText);
      } else {
        toast({
          title: "Voice Processing Not Available",
          description: "Please enable LangGraph in your .env file to use voice features.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error processing voice message:", err);
      setError(err instanceof Error ? err.message : "Failed to process voice message");
      
      // Add error message to chat
      addMessage({
        role: "system",
        content: "Sorry, there was an error processing your voice message. Please try again or type your message instead.",
        type: "alert",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Helper function to detect message type based on response
  const detectMessageType = (response: ChatResponse): MessageWithExtras["type"] => {
    // Extract message type from metadata or determine based on content
    if (response.metadata?.category === "emergency") {
      return "alert";
    } else if (response.metadata?.category === "check-in") {
      return "check-in";
    } else if (response.actions && response.actions.length > 0) {
      return "nudge";
    }
    return "text"; // Default to text type
  };
  
  // Helper function to extract context from response
  const extractContext = (response: ChatResponse): MessageWithExtras["context"] => {
    // Extract context information from metadata
    let mood: MessageWithExtras["context"]["mood"] = undefined;
    
    // Determine mood based on confidence level or specified value
    if (response.metadata?.mood) {
      // Use the mood directly if it matches allowed values
      if (["neutral", "concerned", "encouraging", "urgent", "supportive", "coaching"].includes(response.metadata.mood)) {
        mood = response.metadata.mood as MessageWithExtras["context"]["mood"];
      } else {
        // Default to neutral if not a valid mood
        mood = "neutral";
      }
    } else if (response.metadata?.confidence) {
      // Determine mood based on confidence
      mood = response.metadata.confidence > 0.8 ? "encouraging" : 
             response.metadata.confidence < 0.4 ? "concerned" : "neutral";
    }
    
    return {
      category: response.metadata?.category as MessageWithExtras["context"]["category"],
      actionable: response.actions && response.actions.length > 0,
      options: response.actions?.map(action => action.payload.label || action.type),
      mood,
      relatedData: response.metadata,
    };
  };
  
  // Temporary simulation function for testing without backend
  const simulateResponse = (query: string) => {
    setTimeout(() => {
      const responseOptions = [
        {
          content: "I see you're asking about your blood glucose. Your last reading was 120 mg/dL, which is within your target range. Would you like to log a new reading?",
          type: "text",
          context: {
            category: "glucose" as const,
            actionable: true,
            options: ["Log new reading", "Show my trends", "Not now"],
          },
        },
        {
          content: "It looks like you're due for your Metformin medication soon. Would you like me to remind you when it's time?",
          type: "nudge",
          context: {
            category: "medication" as const,
            actionable: true,
            options: ["Set reminder", "Mark as taken", "Not now"],
          },
        },
        {
          content: "Based on your last few meals, I've noticed your blood sugar tends to spike after breakfast. Would you like some alternative breakfast ideas that might help?",
          type: "text",
          context: {
            category: "meal" as const,
            actionable: true,
            options: ["Show meal suggestions", "Learn more", "Not now"],
          },
        },
        {
          content: "I understand managing diabetes can be challenging. How are you feeling today about your health journey?",
          type: "text",
          context: {
            category: "mood" as const,
            actionable: false,
            mood: "encouraging" as const,
          },
        },
      ];
      
      // Select a response based on the query content
      let responseIndex = 0;
      
      if (query.toLowerCase().includes("glucose") || 
          query.toLowerCase().includes("sugar") || 
          query.toLowerCase().includes("reading")) {
        responseIndex = 0;
      } else if (query.toLowerCase().includes("medicine") || 
                query.toLowerCase().includes("medication") || 
                query.toLowerCase().includes("pill")) {
        responseIndex = 1;
      } else if (query.toLowerCase().includes("food") || 
                query.toLowerCase().includes("eat") || 
                query.toLowerCase().includes("meal")) {
        responseIndex = 2;
      } else if (query.toLowerCase().includes("feel") || 
                query.toLowerCase().includes("tired") || 
                query.toLowerCase().includes("stress")) {
        responseIndex = 3;
      }
      
      const selected = responseOptions[responseIndex];
      
      const assistantMessage: MessageWithExtras = {
        id: Date.now().toString(),
        role: "assistant",
        content: selected.content,
        timestamp: new Date(),
        type: selected.type,
        context: selected.context,
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1500); // Simulate processing time
  };
  
  return {
    messages,
    isProcessing,
    error,
    sendTextMessage,
    sendVoiceMessage,
    addMessage,
    messagesEndRef,
    setMessages,
  };
}
