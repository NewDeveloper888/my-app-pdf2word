import { GoogleGenAI } from "@google/genai";
import { ConversionMode } from "../types";

// Initialize the Gemini API client
// Note: API Key is expected to be in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const convertPdfToHtml = async (base64Pdf: string, mode: ConversionMode): Promise<string> => {
  try {
    const modelId = 'gemini-2.5-flash'; 
    
    let modeInstruction = "";
    switch (mode) {
      case ConversionMode.PRESERVE_LAYOUT:
        modeInstruction = `
          - VISUAL PRIORITY: Strictly maintain the visual layout, column positioning, and tables.
          - Use HTML tables to replicate the PDF grid structure if necessary.
          - Preserve font styles (bold, italic, sizes) and alignment faithfully.
          - If the PDF has a sidebar, keep it as a sidebar (e.g., using a table cell).
        `;
        break;
      case ConversionMode.TEXT_ONLY:
        modeInstruction = `
          - CONTENT ONLY: Extract only the raw text content.
          - Do not use semantic structure like tables, complex lists, or headers if they aren't strictly necessary for reading order.
          - Wrap all text in simple <p> tags.
          - Ignore images, page numbers, and decorative elements.
        `;
        break;
      case ConversionMode.OPTIMIZE_EDITING:
      default:
        modeInstruction = `
          - EDITING PRIORITY: Create a clean, semantic document optimized for editing in Microsoft Word.
          - Prioritize logical flow and clean paragraphs over exact visual coordinate positioning.
          - Use proper HTML tags: <h1>-<h3> for headers, <ul>/<ol> for lists, <table> for actual data tables (not layout).
          - Flatten complex multi-column layouts into a single readable column if it makes the document significantly easier to edit.
        `;
        break;
    }

    const prompt = `
      You are an expert document conversion assistant. 
      Your task is to convert the attached PDF document into semantic HTML code suitable for exporting to Microsoft Word.
      
      CONVERSION MODE: ${mode}
      ${modeInstruction}

      GENERAL GUIDELINES:
      1. Analyze the PDF content deeply.
      2. Output ONLY valid HTML body content (do not include <html>, <head>, or <body> tags).
      3. Ensure all Arabic text is correctly preserved and formatted with dir="rtl".
      4. For tables, use border="1" so they are visible in Word.
      5. Do not output Markdown formatting (no \`\`\`html). Output raw HTML string.
      6. Do not add any conversational text.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: base64Pdf
            }
          },
          {
            text: prompt
          }
        ]
      },
    });

    const text = response.text || "";
    
    // Cleanup: Remove markdown code blocks if the model accidentally adds them
    const cleanText = text.replace(/```html/g, '').replace(/```/g, '').trim();
    
    return cleanText;
  } catch (error) {
    console.error("Gemini Conversion Error:", error);
    throw error;
  }
};