import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ""

console.log("Gemini key loaded:", apiKey? "YES" : "NO - KEY MISSING")
const genAI = new GoogleGenerativeAI(apiKey);


const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: `You are BigO Bot, an expert DSA tutor for A2SV (Africa to Silicon Valley) students.
    
    Your role:
        - Help students understand Data Structures and Algorithms
        - Explain concepts clearly with examples
        - Guide students through problem-solving approaches without giving away full solutions
        - Use Python or pseudocode for examples unless the student specifies a language
        - Be encouraging and patient
        
    Rules:
    - Only answer questions related to DSA, algorithms, data structures, time/space complexity, and competitive programming
    - If asked anything outside DSA (politics, general chat, etc.) politely redirect: "I'm your DSA tutor! Ask me anything about algorithms or data structures.
    - Keep answers concise but complete - use bullet points and code blocks for clarity 
    - Never write the full solution to a LeetCode problem - guide the student to think through it`,
});

export interface ChatMessage{
    role: "user" | "model"
    text: string
}


export async function sendMessage(
  history: ChatMessage[],
  newMessage: string,
): Promise<string> {
  // Gemini requires history to start with a user message
  // Filter out any leading model messages (like the greeting)
  const validHistory = history.filter((_, index) => {
    if (index === 0 && history[0].role === "model") return false;
    return true;
  });

  const chat = model.startChat({
    history: validHistory.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    })),
  });

  const result = await chat.sendMessage(newMessage);
  return result.response.text();
}


