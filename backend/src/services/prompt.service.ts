import { AssignmentDocument } from "../models/Assignment";
import { QuestionTypeConfig } from "../types";

export const buildGenerationPrompt = (
  assignment: AssignmentDocument,
  fileText?: string
): string => {
  const { title, subject, className, questionTypes, additionalInstructions, schoolName, timeAllowed } =
    assignment;

  // Describe the assignment constraints
  let prompt = `You are an expert teacher tasked with creating a highly professional and accurate question paper.\n\n`;
  prompt += `### Assignment Details\n`;
  prompt += `- Title: ${title}\n`;
  prompt += `- Subject: ${subject}\n`;
  prompt += `- Class/Grade: ${className}\n`;
  if (schoolName) {
    prompt += `- School/College Name: ${schoolName}\n`;
  }
  if (timeAllowed) {
    prompt += `- Time Allowed: ${timeAllowed}\n`;
  }

  if (additionalInstructions) {
    prompt += `\n### Additional Instructions from the Teacher\n`;
    prompt += `${additionalInstructions}\n`;
  }

  // Define sections based on question types
  prompt += `\n### Required Question Sections\n`;
  prompt += `You must generate EXACTLY the following sections with the specified number of questions and marks per question:\n`;

  questionTypes.forEach((qt: QuestionTypeConfig, index: number) => {
    const sectionLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    prompt += `\nSection ${sectionLetters[index]}: ${qt.label}\n`;
    prompt += `- Type: ${qt.type}\n`;
    prompt += `- Number of Questions: ${qt.numberOfQuestions}\n`;
    prompt += `- Marks per Question: ${qt.marksPerQuestion}\n`;
    if (qt.type === "mcq") {
      prompt += `- Include exactly 4 plausible options for each question.\n`;
    }
  });

  if (fileText) {
    prompt += `\n### Reference Material\n`;
    prompt += `Generate ALL questions strictly based on the following text. Do not invent facts outside of this material:\n`;
    prompt += `--- START OF MATERIAL ---\n${fileText}\n--- END OF MATERIAL ---\n`;
  } else if (assignment.uploadedFile) {
    prompt += `\n### Reference Material\n`;
    prompt += `I have attached a document file to this request. Generate ALL questions strictly based on the content of the attached document. Do not invent facts outside of this material.\n`;
  } else {
    prompt += `\n### Context\n`;
    prompt += `Use your general knowledge appropriate for this class/grade to generate the questions.\n`;
  }

  prompt += `\n### Output Constraints\n`;
  prompt += `Return ONLY valid JSON matching the specified JSON Schema. Ensure appropriate difficulty (mix of easy, moderate, hard). Ensure 'options' array is populated for MCQ type questions. The 'answer' field should contain the correct answer or explanation.\n`;
  prompt += `IMPORTANT: You MUST populate the "header" object with exactly the following values:\n`;
  if (schoolName) prompt += `- schoolName: "${schoolName}"\n`;
  if (timeAllowed) prompt += `- timeAllowed: "${timeAllowed}"\n`;

  return prompt;
};
