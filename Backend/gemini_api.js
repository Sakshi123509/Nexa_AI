import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in .env");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const responseurl = async (command, assistantName, userName) => {
    try {
        console.log("Gemini API call with:", { command, assistantName, userName });

        const prompt = `You are a virtual assistant named ${assistantName} created by ${userName}.
You are not Google. Behave like voice-enabled assistant.
Respond with ONLY valid JSON.

Use this exact structure:
{
  "type": "general" | "google_search" | "youtube_search" | "youtube_play" | "get_time" | "get_date" | "get_day" | "get_month" | "calculator_open" | "instagram_open" | "facebook_open" | "weather-show" | "cmd_open" | "notepad_open",
  "userInput": "<user input without assistant name>",
  "response": "<short voice response, 1 sentence max>"
}

Rules:
- Do not include backticks
- Do not include markdown
- Output raw JSON only

User: ${command}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.1,
                maxOutputTokens: 200,
            },
        });

        const rawText = response?.text || "";
        const cleaned = rawText.replace(/```json\s*|```/gi, "").trim();
        console.log("Gemini cleaned text:", cleaned);

        if (!cleaned) {
            return {
                type: "general",
                userInput: command,
                response: "I couldn't get a response. Please try again."
            };
        }

        try {
            return JSON.parse(cleaned);
        } catch (parseError) {
            return {
                type: "general",
                userInput: command,
                response: "Sorry, I couldn't understand the response."
            };
        }

    } catch (error) {
        console.log("Gemini SDK Error:", error);
        return {
            type: "general",
            userInput: command,
            response: "Something went wrong while contacting the AI assistant."
        };
    }
};

export default responseurl;