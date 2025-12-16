import OpenAI from "openai";
import "dotenv/config";

export async function analyzeCv(cvText: string, role: string) {
  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    const prompt = `
RETURN JSON ONLY. NO MARKDOWN.

Use this exact shape:

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

RULES:
• Use full scoring range 0–20 for each section.
• Missing, empty, or unclear sections must receive score = 0. No exceptions.
• If resume-like structure is absent (e.g., essay, report, homework, job description), 
  respond with a very short note like "Not a resume." inside improvements[] and 
  set overall_score between 10–40.

SCORING RUBRIC:
0–5   = Very Poor or Missing
6–10  = Weak
11–14 = Average
15–17 = Strong
18–20 = Excellent (only if complete & high-quality)

PROFESSIONAL SUMMARY DETECTION:
The professional summary section may be labeled as:
- "Professional Summary"
- "Summary"
- "Profile"
- "Career Summary"
- "Professional Profile"
- "About"
- "Objective"
- "Executive Summary"
- Or appear at the top of the resume before work experience

Look for a brief paragraph (2-4 sentences) at the beginning of the resume that summarizes the candidate's experience, skills, and career goals. If such content exists, score it appropriately. Only score 0 if NO summary-like content exists at the top of the resume.

OVERALL SCORE = (sum of the 5 section scores) * 5
Round to nearest integer.

Do NOT infer or imagine content that is not explicitly present.
Only score what is clearly written.

Analyze resume for the role: "${role}"
Resume text:
${cvText}


`;

    // Call OpenAI (GPT-4o-mini = free tier)
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    let text = completion.choices[0].message.content?.trim() || "";

    // Strip accidental formatting
    text = text.replace(/```json/gi, "").replace(/```/g, "").trim();

    // Extract JSON
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("OpenAI returned non-JSON");

    return JSON.parse(match[0]);

  } catch (err) {
    console.error("❌ OpenAI analyzeCv error:", err);
    throw err;
  }
}
