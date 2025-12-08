import Tesseract from "tesseract.js";

export async function runOCR(buffer: Buffer): Promise<string> {
  try {
    console.log("🟣 Running OCR (WASM mode)...");

    const { data } = await Tesseract.recognize(buffer, "eng", {
      corePath: require("tesseract.js-core"), // Load WASM core
      logger: m => console.log(m)
    });

    if (data.text?.trim().length > 0) {
      console.log("✔ OCR succeeded");
      return data.text;
    }

    console.log("⚠ OCR returned empty text");
    return "";
  } catch (err) {
    console.error("❌ OCR error:", err);
    return "";
  }
}
