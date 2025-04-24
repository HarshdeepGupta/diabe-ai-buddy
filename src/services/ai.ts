import logger from "../utils/logger";
import { Profile, CalendarEvent } from "../context/ProfileContext";
import { getApiKey, API_KEYS } from "@/utils/env";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// This would normally be environment variables
const API_KEY = getApiKey("GEMINI_API_KEY");

// Initialize Google Generative AI
const googleAI = new GoogleGenerativeAI(API_KEY);
const modelInstance = googleAI.getGenerativeModel({
  model: "gemini-2.0-flash" // Updated model name
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

    const prompt = `Create a personalized schedule for a Type 2 diabetic patient.
    The patient is ${profile.age} years old, weighs ${profile.weight}${profile.weightUnit}, and has been diabetic for ${profile.t2dDuration} years.
    They take the following medications: ${JSON.stringify(profile.medications)}.
    They prefer the following activities: ${JSON.stringify(profile.activityPreferences)}.
    
    `;

    // // Create prompt with chain-of-thought
    // const response = await openai.chat.completions.create({
    //   model: "gpt-4o",
    //   messages: [
    //     {
    //       role: "system",
    //       content: `You are a diabetes management AI assistant. Your task is to create a personalized schedule 
    //       for a Type 2 diabetic patient. Follow a step-by-step reasoning process:
          
    //       1. Analyze the patient's age, weight, and diabetes duration
    //       2. Consider their medication schedule and requirements
    //       3. Plan appropriate exercise activities based on their preferences
    //       4. Ensure medication timing aligns with meals
    //       5. Schedule post-meal exercise at appropriate intervals
    //       6. Create a balanced daily routine that's manageable and realistic
          
    //       Return a complete day's schedule with specific times and detailed descriptions.`,
    //     },
    //     {
    //       role: "user",
    //       content: `Please generate a personalized schedule for my Type 2 diabetes management.
    //       My profile:
    //       - Age: ${profile.age}
    //       - Weight: ${profile.weight}${profile.weightUnit}
    //       - T2D Duration: ${profile.t2dDuration} years
    //       - Medications: ${JSON.stringify(profile.medications)}
    //       - Activity Preferences: ${JSON.stringify(profile.activityPreferences)}`,
    //     },
    //   ],
    //   functions: [functionSchema],
    //   function_call: { name: "generate_diabetes_schedule" },
    // });

    const result = await modelInstance.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    logger.info("AI response received", { responseText });
    

    // // Extract and parse the function call
    // const functionCall = response.choices[0].message.function_call;
    // if (!functionCall || !functionCall.arguments) {
    //   throw new Error("Failed to generate schedule: No function call returned");
    // }

    // const parsedResponse = JSON.parse(functionCall.arguments);
    // logger.info("Successfully generated schedule with AI", {
    //   eventsCount: parsedResponse.events.length,
    // });

    // Log the text and show it in the UI
    logger.info("AI response text", { responseText });
    // return NULL;
    // return a null value for now to avoid breaking the app
    return null;

    // ALso show a toast or something in the UI
    // toast.success("AI generated schedule successfully {" + responseText + "}");

    // return parsedResponse.events;
  } catch (error) {
    logger.error("Error generating schedule with AI", { error });
    throw new Error(`Failed to generate schedule: ${error instanceof Error ? error.message : String(error)}`);
  }
}
