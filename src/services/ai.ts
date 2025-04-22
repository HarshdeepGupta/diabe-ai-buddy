
import { OpenAI } from "openai";
import logger from "../utils/logger";
import { Profile, CalendarEvent } from "../context/ProfileContext";

// This would normally be environment variables
const API_KEY = "sk-placeholder-key"; // This will be replaced with actual key in production

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true, // For demo purposes only
});

/**
 * Function to generate a personalized schedule using GPT-4
 * @param profile User profile data
 * @returns Array of calendar events
 */
export async function generateSchedule(profile: Profile): Promise<CalendarEvent[]> {
  try {
    logger.info("Generating schedule with AI", { profile });

    // Define function calling schema for GPT
    const functionSchema = {
      name: "generate_diabetes_schedule",
      description: "Generate a personalized schedule for type 2 diabetes management",
      parameters: {
        type: "object",
        properties: {
          events: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                startTime: { type: "string", format: "date-time" },
                endTime: { type: "string", format: "date-time" },
                description: { type: "string" },
                type: { type: "string", enum: ["medication", "exercise", "meal"] },
              },
              required: ["title", "startTime", "description", "type"],
            },
          },
          reasoning: { type: "string" },
        },
        required: ["events", "reasoning"],
      },
    };

    // Create prompt with chain-of-thought
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a diabetes management AI assistant. Your task is to create a personalized schedule 
          for a Type 2 diabetic patient. Follow a step-by-step reasoning process:
          
          1. Analyze the patient's age, weight, and diabetes duration
          2. Consider their medication schedule and requirements
          3. Plan appropriate exercise activities based on their preferences
          4. Ensure medication timing aligns with meals
          5. Schedule post-meal exercise at appropriate intervals
          6. Create a balanced daily routine that's manageable and realistic
          
          Return a complete day's schedule with specific times and detailed descriptions.`,
        },
        {
          role: "user",
          content: `Please generate a personalized schedule for my Type 2 diabetes management.
          My profile:
          - Age: ${profile.age}
          - Weight: ${profile.weight}${profile.weightUnit}
          - T2D Duration: ${profile.t2dDuration} years
          - Medications: ${JSON.stringify(profile.medications)}
          - Activity Preferences: ${JSON.stringify(profile.activityPreferences)}`,
        },
      ],
      functions: [functionSchema],
      function_call: { name: "generate_diabetes_schedule" },
    });

    // Extract and parse the function call
    const functionCall = response.choices[0].message.function_call;
    if (!functionCall || !functionCall.arguments) {
      throw new Error("Failed to generate schedule: No function call returned");
    }

    const parsedResponse = JSON.parse(functionCall.arguments);
    logger.info("Successfully generated schedule with AI", {
      eventsCount: parsedResponse.events.length,
    });

    return parsedResponse.events;
  } catch (error) {
    logger.error("Error generating schedule with AI", { error });
    throw new Error(`Failed to generate schedule: ${error instanceof Error ? error.message : String(error)}`);
  }
}
