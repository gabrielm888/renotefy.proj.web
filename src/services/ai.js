// Gemini API integration for Renotify AI features
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with environment variable
const getApiKey = () => {
  return import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyAUyIyg7cmUtgSXISTAT7shqTPoQkIN9xs";
};

// Initialize the Gemini API client
const initializeGeminiAI = () => {
  const genAI = new GoogleGenerativeAI(getApiKey());
  return genAI;
};

// Generate text using the Gemini API
export const generateText = async (prompt, temperature = 0.7) => {
  try {
    const genAI = initializeGeminiAI();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating text with Gemini API:", error);
    throw error;
  }
};

// Text summarization function
export const summarizeText = async (text, length = "medium") => {
  const lengthMap = {
    short: "brief, concise summary (2-3 sentences)",
    medium: "comprehensive summary (1 paragraph)",
    long: "detailed summary with key points (multiple paragraphs)"
  };

  const prompt = `Summarize the following text in a ${lengthMap[length]}. Make key points bold using markdown.
  
  Text to summarize:
  ${text}
  `;

  return await generateText(prompt);
};

// Mind mapping function - returns JSON structure to render a mind map
export const generateMindMap = async (text) => {
  const prompt = `Create a mind map structure based on the following content. 
  Return ONLY the JSON output in the following format:
  {
    "central": "Main Topic",
    "nodes": [
      {
        "id": "1",
        "title": "First Main Branch",
        "color": "#3b82f6",
        "children": [
          {"id": "1-1", "title": "Sub Topic 1", "color": "#60a5fa"},
          {"id": "1-2", "title": "Sub Topic 2", "color": "#60a5fa"}
        ]
      },
      {
        "id": "2",
        "title": "Second Main Branch",
        "color": "#ec4899",
        "children": [
          {"id": "2-1", "title": "Sub Topic 1", "color": "#f472b6"}
        ]
      }
    ]
  }
  Ensure the mind map accurately represents the key concepts and relationships found in the text. Use different colors for different branches.
  
  Text content:
  ${text}
  `;

  const result = await generateText(prompt);
  try {
    return JSON.parse(result);
  } catch (error) {
    console.error("Error parsing mind map JSON:", error);
    throw new Error("Failed to generate mind map");
  }
};

// Generate quiz questions based on note content
export const generateQuiz = async (text, options = { difficulty: "medium", count: 5, type: "mixed" }) => {
  const { difficulty, count, type } = options;
  
  const prompt = `Create a quiz based on this content:
  
  "${text}"
  
  Generate ${count} questions at ${difficulty} difficulty. 
  ${type === "mcq" ? "Only create multiple-choice questions with 4 options each." : 
    type === "short" ? "Only create short-answer questions." : 
    "Create a mix of multiple-choice (with 4 options each) and short-answer questions."}
  
  Format the output as a JSON array of question objects:
  [{
    "id": "1",
    "type": "mcq", // or "short"
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"], // only for mcq type
    "answer": "Correct answer" // Option letter for mcq, or answer text for short
  }]`;

  const result = await generateText(prompt);
  try {
    return JSON.parse(result);
  } catch (error) {
    console.error("Error parsing quiz JSON:", error);
    throw new Error("Failed to generate quiz");
  }
};

// AI grammar and style review function
export const reviewText = async (text) => {
  const prompt = `Review the following text for grammar, style, and content issues. Identify any problems and suggest improvements.
  Return the response in this format:
  [
    {
      "type": "grammar", // or "style" or "content"
      "snippet": "original text with issue",
      "suggestion": "suggested correction",
      "explanation": "brief explanation of the issue"
    }
  ]
  
  Text to review:
  ${text}
  `;

  const result = await generateText(prompt);
  try {
    return JSON.parse(result);
  } catch (error) {
    console.error("Error parsing review JSON:", error);
    throw new Error("Failed to generate review");
  }
};

// Generate an emoji that represents the note content
export const generateEmojiForTitle = async (title, content) => {
  const prompt = `Based on this note title and content, suggest a single emoji that best represents it.
  Title: ${title}
  Content snippet: ${content.substring(0, 200)}...
  
  Respond with only the emoji and nothing else.`;

  return await generateText(prompt);
};

// Translate note content to a different language
export const translateContent = async (text, targetLanguage) => {
  const prompt = `Translate the following text into ${targetLanguage}:
  
  ${text}
  
  Provide only the translated text without any explanations.`;

  return await generateText(prompt);
};

// Chatbot function
export const chatWithAI = async (messages, includeNoteContext = false, noteContent = "") => {
  try {
    const genAI = initializeGeminiAI();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    let chat;
    
    if (includeNoteContext && noteContent) {
      // Create a new chat with note context
      chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [`I am working on a note with the following content: ${noteContent.substring(0, 1000)}... Please keep this in mind when answering my questions.`],
          },
          {
            role: "model",
            parts: ["I'll keep this note content in mind when answering your questions. What would you like to know?"],
          },
        ],
      });
    } else {
      // Create a new chat without context
      chat = model.startChat();
    }
    
    // Add previous messages to the chat
    for (let i = 0; i < messages.length - 1; i++) {
      const message = messages[i];
      await chat.sendMessage(message.content);
    }
    
    // Send the last message and get the response
    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    
    return result.response.text();
  } catch (error) {
    console.error("Error in chatbot:", error);
    throw error;
  }
};

export default {
  generateText,
  summarizeText,
  generateMindMap,
  generateQuiz,
  reviewText,
  generateEmojiForTitle,
  translateContent,
  chatWithAI
};
