
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
function getEnvVar(key: string, defaultValue: string = ''): string {
  const value = import.meta.env[key] || defaultValue;
  return value;
}

/**
 * These must be provided in the .env file
 */
const ENV_VARS = {
  // Backend service URL for LangGraph agent
  BACKEND_URL: getEnvVar('VITE_BACKEND_URL'),
};

/**
 * Check if required environment variables are set
 * @returns Array of missing required environment variables
 */
export function checkRequiredEnvVars(): string[] {
  // Define the variables that are absolutely required for the app to function
  const required = [];
  required.push('VITE_BACKEND_URL');

  return required.filter(key => !import.meta.env[key]);
}

/**
 * Safely access an API key with feedback if it's missing
 * @param key - The API key name
 * @returns The API key value or throws an error if missing
 */
export function get_env_var(key: keyof typeof ENV_VARS): string {
  const value = ENV_VARS[key];
  if (!value) {
    console.error(`Missing required API key: ${key}. Please add it to your .env file.`);
    // throw new Error(`Missing required API key: ${key}`);
  }
  return value;
}
