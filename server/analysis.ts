import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

export async function analyzeCv(cvText: string, role: string) {
  const apiKey = process.env.GEMINI_API_KEY!;
  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
RETURN JSON ONLY. NO MARKDOWN. sections score [0-20]. overall score[0-100] STRICTLY THIS SHAPE:

{
  "overall_score": number,
  "section_scores": {
    "professional_summary": number,
    "work_experience": number,
    "skills": number,
    "education": number,
    "format": number
  },
  "strengths": string[],
  "improvements": string[],
  "ats_tips": string[]
}

Analyze this resume for the role "${role}". Scores MUST be numbers.
Resume:
${cvText}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",   // This exists in the new SDK
      contents: prompt,
    });

    let text = response.text;

    text = text.replace(/```json/gi, "").replace(/```/g, "").trim();

    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Gemini returned non-JSON");

    return JSON.parse(match[0]);

  } catch (err) {
    console.error("❌ Gemini error:", err);
    throw err;
  }
}
