import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import { requireAuth } from "./auth.js";
import "dotenv/config";
import { analyzeCv } from "./analysis.js";
import multer from "multer";
import pdf from "pdf-parse-fixed";
import { extractTextFromPDF } from "./pdf.js";
import { getCacheKey, getCachedResult, setCachedResult } from "./cache.js";



const upload = multer();
const app = express();
const PORT = Number(process.env.PORT || 4000);

/* --------------------------------------------------------
   CORS
--------------------------------------------------------- */
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:8080"],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* --------------------------------------------------------
   SUPABASE CLIENTS
--------------------------------------------------------- */
const supabaseUrl = process.env.SUPABASE_URL!;
const anon = process.env.SUPABASE_ANON_KEY!;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supaAdmin = createClient(supabaseUrl, serviceRole);
const supaPublic = createClient(supabaseUrl, anon);

/* --------------------------------------------------------
   REGISTER USER
--------------------------------------------------------- */
app.post("/register", async (req, res) => {
  const { email, password, name } = req.body ?? {};
  if (!email || !password)
    return res.status(400).json({ error: "email and password required" });

  const { data, error } = await supaAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name: name ?? "" },
  });

  if (error) return res.status(400).json({ error: error.message });

  return res.status(201).json({ userId: data.user?.id });
});

/* --------------------------------------------------------
   LOGIN USER
--------------------------------------------------------- */
app.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password)
    return res.status(400).json({ error: "email and password required" });

  const { data, error } = await supaPublic.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session)
    return res
      .status(401)
      .json({ error: error?.message || "invalid credentials" });

  res.json({
    token: data.session.access_token,
    user: {
      id: data.user.id,
      email: data.user.email,
      name: (data.user.user_metadata as any)?.name ?? "",
    },
  });
});

/* --------------------------------------------------------
   ME ENDPOINT
--------------------------------------------------------- */
app.get("/me", requireAuth, (req, res) => {
  res.json({ user: (req as any).user });
});



/* --------------------------------------------------------
   ANALYZE CV WITH GEMINI
--------------------------------------------------------- */
app.post("/api/analyze", upload.single("file"), async (req: any, res) => {
  try {
    const role = req.body.role || "General";
    let cvText = "";

    if (req.file) {
    const buffer = req.file.buffer;
    cvText = await extractTextFromPDF(buffer);
  }


    if (!cvText || cvText.trim().length < 30) {
      return res.json({
        overall_score: 15,
        section_scores: {
          professional_summary: 0,
          work_experience: 0,
          skills: 0,
          education: 0,
          format: 0,
        },
        strengths: [],
        improvements: ["Not a resume (empty file or unreadable)."],
        ats_tips: [],
      });
    }

    // Check cache first
    const cacheKey = getCacheKey(cvText, role);
    const cachedResult = await getCachedResult(cacheKey);

    if (cachedResult) {
      return res.json(cachedResult);
    }

    // Cache miss - call OpenAI
    const results = await analyzeCv(cvText, role);

    // Heuristic fix: if professional_summary is 0 but overall is high,
    // distribute missing points to professional_summary (up to 20)
    const currentSectionSum =
      results.section_scores.professional_summary +
      results.section_scores.work_experience +
      results.section_scores.skills +
      results.section_scores.education +
      results.section_scores.format;

    const targetSectionSum = Math.round(results.overall_score / 5);

    if (
      results.section_scores.professional_summary === 0 &&
      results.overall_score >= 80 &&
      targetSectionSum > currentSectionSum
    ) {
      const diff = targetSectionSum - currentSectionSum;
      const boosted = Math.min(20, diff);
      if (boosted > 0) {
        console.warn(
          `⚠️ Boosting professional_summary by ${boosted} to better align with overall score.`
        );
        results.section_scores.professional_summary = boosted;
      }
    }

    // Recalculate overall score from section scores to keep things consistent
    const sectionSum =
      results.section_scores.professional_summary +
      results.section_scores.work_experience +
      results.section_scores.skills +
      results.section_scores.education +
      results.section_scores.format;

    const calculatedOverall = Math.round(sectionSum * 5);

    if (Math.abs(results.overall_score - calculatedOverall) > 5) {
      console.warn(
        `⚠️ Overall score mismatch: ${results.overall_score} vs calculated ${calculatedOverall}. Using calculated value.`
      );
      results.overall_score = calculatedOverall;
    }

    // Store in cache (7 days TTL)
    await setCachedResult(cacheKey, results, 604800);

    return res.json(results);

  } catch (err: any) {
    console.error("Analyze Error:", err);
    return res.status(500).json({ error: err.message });
  }
});
/* --------------------------------------------------------
   ROOT ENDPOINT
--------------------------------------------------------- */
app.get("/", (_req, res) => {
  res.json({ 
    message: "CV Feedback Bot API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      register: "POST /register",
      login: "POST /login",
      me: "GET /me",
      analyze: "POST /api/analyze"
    }
  });
});

/* --------------------------------------------------------
   HEALTH CHECK
--------------------------------------------------------- */
app.get("/health", (_req, res) => res.json({ ok: true }));

/* --------------------------------------------------------
   START SERVER
--------------------------------------------------------- */
app.listen(PORT, () =>
  console.log(`API listening on http://localhost:${PORT}`)
);  