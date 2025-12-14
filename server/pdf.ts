import pdf from "pdf-parse-fixed";
import { runOCR } from "./ocr.js";

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const parsed = await pdf(buffer);
    const text = parsed.text?.trim() || "";

    if (text.length > 50) {
      console.log("✔ Normal PDF text extraction succeeded");
      return text;
    }

    console.log("⚠ PDF contains little or no extractable text → using OCR fallback");
    return await runOCR(buffer);

  } catch (err) {
    console.log("❌ PDF parse failed → using OCR fallback", err);
    return await runOCR(buffer);
  }
}
