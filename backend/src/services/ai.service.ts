import { GoogleGenAI, Type, Schema } from "@google/genai";
import { logger } from "../utils/logger";
import { env } from "../config/env";

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

const generatedPaperSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    header: {
      type: Type.OBJECT,
      properties: {
        schoolName: { type: Type.STRING },
        subject: { type: Type.STRING },
        className: { type: Type.STRING },
        timeAllowed: { type: Type.STRING },
        maximumMarks: { type: Type.INTEGER },
        generalInstructions: { type: Type.STRING },
      },
      required: [
        "schoolName",
        "subject",
        "className",
        "timeAllowed",
        "maximumMarks",
        "generalInstructions",
      ],
    },
    sections: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          sectionType: { type: Type.STRING },
          instructions: { type: Type.STRING },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                questionNumber: { type: Type.INTEGER },
                text: { type: Type.STRING },
                difficulty: {
                  type: Type.STRING,
                  enum: ["easy", "moderate", "hard"],
                },
                marks: { type: Type.INTEGER },
                answer: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Provide exactly 4 options if the question type is mcq, otherwise leave empty.",
                },
              },
              required: ["questionNumber", "text", "difficulty", "marks", "answer"],
            },
          },
        },
        required: ["title", "sectionType", "instructions", "questions"],
      },
    },
  },
  required: ["header", "sections"],
};

export const generateQuestionPaper = async (
  prompt: string,
  fileData?: { mimeType: string; data: string }
) => {
  try {
    const contents: any[] = [{ text: prompt }];

    // If file is provided, pass as inline data
    if (fileData) {
      contents.unshift({
        inlineData: {
          mimeType: fileData.mimeType,
          data: fileData.data, // Base64 encoded string
        },
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: generatedPaperSchema,
        temperature: 0.7,
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from Gemini");
    }

    return JSON.parse(resultText);
  } catch (error) {
    logger.error("AI Generation Error", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to generate question paper"
    );
  }
};
