import { GoogleGenAI } from "@google/genai";

export async function humanizeText(text: string, language: string) {
  const prompt = `
    You are a professional editor. Your task is to "humanize" the following AI-generated text.
    Make it sound natural, engaging, and indistinguishable from human writing.
    Maintain the core meaning but improve flow, vocabulary, and sentence structure.
    
    Language: ${language}
    
    Text to humanize:
    ${text}
    
    Return the humanized text. Also, identify the specific words or phrases you changed or improved.
    Return the result in STRICT JSON format:
    {
      "humanizedText": "the full humanized text",
      "changedWords": ["word1", "phrase1", ...]
    }
  `;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "") {
      return { error: "Gemini API Key is missing. Please add it to your environment variables." };
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const responseText = response.text;
    if (!responseText) {
      return { error: "The AI returned an empty response. Please try again." };
    }

    return JSON.parse(responseText);
  } catch (error: any) {
    console.error("Error humanizing text:", error);
    if (error?.message?.includes("API key not valid")) {
      return { error: "Invalid API Key. Please check your GEMINI_API_KEY configuration." };
    }
    return { error: error?.message || "Failed to connect to the AI service." };
  }
}

export async function getDefinition(word: string) {
  const prompt = `
    Provide a concise Oxford-style dictionary definition for the word: "${word}".
    Include the part of speech and an example sentence.
    Return in STRICT JSON:
    {
      "word": "${word}",
      "partOfSpeech": "...",
      "definition": "...",
      "example": "..."
    }
  `;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "") return null;

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error getting definition:", error);
    return null;
  }
}
