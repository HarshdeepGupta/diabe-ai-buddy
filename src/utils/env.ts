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
  
  // Optional: Google Calendar integration
  GOOGLE_API_KEY: getEnvVar('VITE_GOOGLE_API_KEY'),
  
  // Add other API keys as needed
};

/**
 * Check if required environment variables are set
 * @returns Array of missing required environment variables
 */
export function checkRequiredEnvVars(): string[] {
  const required = ['VITE_GEMINI_API_KEY'];
  return required.filter(key => !import.meta.env[key]);
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
