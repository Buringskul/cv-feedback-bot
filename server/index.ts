import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import { requireAuth } from "./auth.js";
import "dotenv/config";
import { analyzeCv } from "./analysis.js";
import multer from "multer";
import pdf from "pdf-parse-fixed";


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
app.post(
  "/api/analyze",
  upload.single("file"),
  async (req: express.Request & { file?: any; body: any }, res) => {
    try {
      const role = req.body.role || "General";
      let cvText = "";

      // 1. PDF file upload
      if (req.file) {
        const buffer = req.file.buffer;
        const parsed = await pdf(buffer);   // ONLY THIS LINE! WORKS 100%
        cvText = parsed.text;
      }
      // 2. Text-based resume input
      else if (req.body.cvText) {
        cvText = req.body.cvText;
      }
      // 3. No input
      else {
        return res.status(400).json({ error: "No CV file or text provided" });
      }

      const results = await analyzeCv(cvText, role);
      return res.json(results);

    } catch (err: any) {
      console.error("Analyze Error:", err);
      return res.status(500).json({ error: err.message });
    }
  }
);
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
