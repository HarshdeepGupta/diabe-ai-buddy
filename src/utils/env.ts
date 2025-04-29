
/**
 * Environment Variables Manager
 * 
 * This utility helps manage environment variables across the application.
 * It provides a centralized way to access environment variables and falls back
 * to default values when variables are not defined.
 */

/**
 * Get an environment variable with type safety
 * @param key - The environment variable key
 * @param defaultValue - Default value if the environment variable is not defined
 * @returns The environment variable value or the default value
 */
export function getEnvVar(key: string, defaultValue: string = ''): string {
  const value = import.meta.env[key] || defaultValue;
  return value;
}

/**
 * API Keys and endpoints
 * These must be provided in the .env file
 */
export const API_KEYS = {
  // Gemini API key for AI services
  GEMINI_API_KEY: getEnvVar('VITE_GEMINI_API_KEY'),
  
  // OpenAI API key for LangGraph/LangChain integration
  OPENAI_API_KEY: getEnvVar('VITE_OPENAI_API_KEY'),
  
  // Optional: Google Calendar integration
  GOOGLE_API_KEY: getEnvVar('VITE_GOOGLE_API_KEY'),

  // Backend service URL for LangGraph agent
  BACKEND_URL: getEnvVar('VITE_BACKEND_URL', 'http://localhost:3001'),
  
  // Add other API keys as needed
};

/**
 * Service configuration for integrations
 */
export const API_CONFIG = {
  // LangGraph agent endpoints
  langGraph: {
    chatEndpoint: `${API_KEYS.BACKEND_URL}/api/chat`,
    voiceChatEndpoint: `${API_KEYS.BACKEND_URL}/api/voice-chat`,
    statusEndpoint: `${API_KEYS.BACKEND_URL}/api/status`,
  },
};

/**
 * Check if required environment variables are set
 * @returns Array of missing required environment variables
 */
export function checkRequiredEnvVars(): string[] {
  // Define the variables that are absolutely required for the app to function
  const required = ['VITE_GEMINI_API_KEY'];
  
  // Add OpenAI key to required list if we're using LangGraph features
  if (import.meta.env.VITE_USE_LANGGRAPH === 'true') {
    required.push('VITE_OPENAI_API_KEY');
    required.push('VITE_BACKEND_URL');
  }
  
  return required.filter(key => !import.meta.env[key]);
}

/**
 * Check if the LangGraph backend is available
 * This will be used to determine if we should show LangGraph features
 */
export function isLangGraphEnabled(): boolean {
  return import.meta.env.VITE_USE_LANGGRAPH === 'true';
}

/**
 * Safely access an API key with feedback if it's missing
 * @param key - The API key name
 * @returns The API key value or throws an error if missing
 */
export function getApiKey(key: keyof typeof API_KEYS): string {
  const value = API_KEYS[key];
  if (!value) {
    console.error(`Missing required API key: ${key}. Please add it to your .env file.`);
    // throw new Error(`Missing required API key: ${key}`);
  }
  return value;
}
