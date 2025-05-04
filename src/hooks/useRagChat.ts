import { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import { get_env_var } from "../utils/env.ts";

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

  // Voice chat states
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
        const backendUrl = get_env_var("BACKEND_URL");
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

  // Start voice recording
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.addEventListener("dataavailable", (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      });
      mediaRecorderRef.current.addEventListener("stop", handleRecordingStop);
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone", error);
      alert("Failed to access microphone. Please try again.");
    }
  }, [topic, messages]);

  // Stop voice recording
  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    setIsProcessingVoice(true);
  }, []);

  // Handle recording stop and send audio to backend
  const handleRecordingStop = useCallback(async () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    console.debug("Recorded audio blob size (bytes):", audioBlob.size);
    const arrayBuffer = await audioBlob.arrayBuffer();
    try {
      const backendUrl = get_env_var("BACKEND_URL");
      console.debug("POST to audio endpoint:", `${backendUrl}/api/answerQuestionWithAudio`);
      const response = await axios.post(`${backendUrl}/api/answerQuestionWithAudio`, {
        audioBytes: Array.from(new Uint8Array(arrayBuffer)),
        category: topic,
        conversationHistory: messages.map((msg) => ({ role: msg.role, content: msg.content })),
      });
      console.debug("Audio endpoint response status/data:", response.status, response.data);
      // Extract base64 audio, follow-up questions, and transcripts
      const { audio: audioB64, followups, question_text, answer_text } = response.data as {
        audio: string;
        followups: string[];
        question_text: string;
        answer_text: string;
      };
      // Add user transcript message for the spoken question
      const userTranscript: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content: question_text,
        timestamp: new Date(),
        type: "voice",
      };
      setMessages((prev) => [...prev, userTranscript]);
      // Add assistant voice message
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: answer_text, // populate with backend answer_text
        timestamp: new Date(),
        type: "voice",
        context: { options: followups },
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setFollowupQuestions(followups);

      // Decode base64 to binary and play audio
      const binaryString = atob(audioB64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const audioBlobResponse = new Blob([bytes], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlobResponse);
      audioRef.current = new Audio(audioUrl);
      audioRef.current.addEventListener("ended", () => {
        setIsSpeaking(false);
      });
      setIsSpeaking(true);
      await audioRef.current.play();
    } catch (error: any) {
      console.error("Error processing voice message:", error, error.response?.data);
      const errMsg = error.response?.data?.error || error.message || "Unknown error";
      alert(`Failed to process voice message: ${errMsg}`);
    } finally {
      setIsProcessingVoice(false);
    }
  }, [topic, messages]);

  return {
    messages,
    isLoading,
    followupQuestions,
    sendMessage,
    clearMessages,
    addSystemMessage,
    // Voice controls
    isRecording,
    isProcessingVoice,
    isSpeaking,
    startRecording,
    stopRecording,
    audioRef,
  };
}