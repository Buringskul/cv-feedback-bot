import Tesseract from "tesseract.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

export async function runOCR(buffer: Buffer): Promise<string> {
  try {
     console.log("🟣 Running OCR (WASM mode)...");

    const corePath = require.resolve("tesseract.js-core");

    const { data } = await Tesseract.recognize(buffer, "eng", {
      corePath,
      logger: (m) => console.log(m),
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
