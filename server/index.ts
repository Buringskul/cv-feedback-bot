import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import { requireAuth } from "./auth.js";
import "dotenv/config";

const app = express();
const PORT = Number(process.env.PORT || 4000);

// CORS: allow Vite dev origin
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL!;
const anon = process.env.SUPABASE_ANON_KEY!;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Admin client for creating users server-side
const supaAdmin = createClient(supabaseUrl, serviceRole);

// Public client for server-initiated email/password login
const supaPublic = createClient(supabaseUrl, anon);

/**
 * POST /register
 * body: { email, password, name? }
 * Creates a Supabase user (email/password). Email is auto-confirmed here for dev.
 * In production, set email_confirm: false and handle magic-link confirmation instead.
 */
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:8080"],
    credentials: false,
  })
);

app.post("/register", async (req, res) => {
  const { email, password, name } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: "email and password required" });

  const { data, error } = await supaAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name: name ?? "" },
  });

  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json({ userId: data.user?.id });
});

/**
 * POST /login
 * body: { email, password }
 * Signs in with email/password and returns the Supabase access token + basic user.
 */
app.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: "email and password required" });

  const { data, error } = await supaPublic.auth.signInWithPassword({ email, password });
  if (error || !data.session) return res.status(401).json({ error: error?.message || "invalid credentials" });

  res.json({
    token: data.session.access_token,
    user: {
      id: data.user.id,
      email: data.user.email,
      name: (data.user.user_metadata as any)?.name ?? "",
    },
  });
});

/**
 * GET /me
 * Requires Authorization: Bearer <supabase access token>
 * Demonstrates verifying tokens (Google or email+password).
 */
app.get("/me", requireAuth, (req, res) => {
  res.json({ user: (req as any).user });
});

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));