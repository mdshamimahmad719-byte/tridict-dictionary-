import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DictionaryEntry } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const dictionarySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    headword: { type: Type.STRING, description: "The word in its main language form" },
    partOfSpeech: { type: Type.STRING, description: "e.g., Noun, Verb" },
    pronunciation: { type: Type.STRING, description: "IPA or Romanized pronunciation" },
    
    wordL1: { type: Type.STRING, description: "Bangla translation" },
    pronunciationL1: { type: Type.STRING, description: "Bangla pronunciation written in Bangla script (e.g. 'উচ্চারণ')" },
    meaningL1: { type: Type.STRING, description: "Bangla definition" },
    synonymsL1: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 Bangla synonyms" },
    antonymsL1: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 Bangla antonyms" },
    exampleL1: { type: Type.STRING, description: "Bangla usage sentence" },

    translationL2: { type: Type.STRING, description: "English translation" },
    pronunciationL2: { type: Type.STRING, description: "English phonetic pronunciation" },
    meaningL2: { type: Type.STRING, description: "English definition" },
    synonymsL2: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 English synonyms" },
    antonymsL2: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 English antonyms" },
    exampleL2: { type: Type.STRING, description: "English usage sentence" },

    translationL3: { type: Type.STRING, description: "Third language translation" },
    pronunciationL3: { type: Type.STRING, description: "Third language phonetic pronunciation" },
    meaningL3: { type: Type.STRING, description: "Third language definition" },
    synonymsL3: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 synonyms" },
    antonymsL3: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 antonyms" },
    exampleL3: { type: Type.STRING, description: "Usage sentence in third language" },

    usageNote: { type: Type.STRING, description: "Brief usage note in Bangla" },
    etymology: { type: Type.STRING, description: "Brief origin/etymology in Bangla" },
  },
  required: [
    "headword", "partOfSpeech", "pronunciation", 
    "wordL1", "pronunciationL1", "meaningL1", "synonymsL1", "exampleL1",
    "translationL2", "pronunciationL2", "meaningL2", "synonymsL2", "exampleL2",
    "translationL3", "pronunciationL3", "meaningL3", "synonymsL3", "exampleL3"
  ],
};

export const lookupWord = async (word: string, thirdLanguage: string): Promise<DictionaryEntry> => {
  try {
    const prompt = `
      Dictionary Analysis for "${word}".
      Target Languages: 
      1. Bangla (L1)
      2. English (L2)
      3. ${thirdLanguage} (L3)
      
      Requirements:
      - Provide ACCURATE translations.
      - Provide Phonetic/IPA pronunciations for ALL 3 languages.
      - CRITICAL: For Bangla (L1), the pronunciation MUST be written in Bangla script (e.g., for 'Mother' -> 'মাদার'). Do NOT use English/IPA for Bangla pronunciation.
      - CRITICAL: Usage Note and Etymology MUST be written in Bangla.
      - 3 Synonyms and 3 Antonyms for each language.
      - 1 concise example sentence for each language.
      - Ensure Bangla output is in correct Bangla script.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: dictionarySchema,
        temperature: 0.3,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No data received");
    
    return JSON.parse(text) as DictionaryEntry;
  } catch (error) {
    console.error("Error fetching dictionary data:", error);
    throw error;
  }
};

export const generateWordImage = async (word: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Minimalist vector icon or illustration for "${word}". White background, red and black accent colors.`,
          },
        ],
      },
      config: {
        imageConfig: {
            aspectRatio: "4:3",
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }
    return null;
  } catch (error) {
    console.warn("Image generation skipped or failed:", error);
    return null;
  }
};