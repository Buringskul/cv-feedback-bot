// src/components/AuthForm.tsx
import { useState } from "react";
import { api } from "../integrations/api/client";
import { supabase, supabaseReady } from "../integrations/supabase/client";

type Mode = "signup" | "signin";

export default function AuthForm({ mode }: { mode: Mode }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const supabaseUnavailable = !supabaseReady;
  

  // Helpful sanity logs (remove later)
  // These should NOT be undefined
  // @ts-ignore
  console.log("VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
  // @ts-ignore
  console.log("VITE_SUPABASE_ANON_KEY starts:", String(import.meta.env.VITE_SUPABASE_ANON_KEY || "").slice(0, 8) + "...");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        await api.register(email, password, name || undefined);
        setMsg("Account created! You can sign in now.");
      } else {
        const r = await api.login(email, password); // { token, user }
        localStorage.setItem("auth_token", r.token);
        localStorage.setItem("auth_user", JSON.stringify(r.user));
        setMsg(`Signed in as ${r.user.email}`);
        // OPTIONAL: navigate to home/dashboard
        window.location.origin
      }
    } catch (err: any) {
      console.error("Email auth error:", err);
      setMsg(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    if (!supabase || supabaseUnavailable) {
      setMsg(
        "Google sign-in is disabled because Supabase env vars are not configured."
      );
      return;
    }

    const client = supabase;
    setMsg(null);
    setGoogleLoading(true);
    try {
      const { data, error } = await client.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin }, // e.g., http://localhost:5173
      });
      if (error) {
        console.error("Google OAuth error:", error);
        setMsg(error.message);
      } else {
        // Supabase will redirect; after coming back, you'll have a session
        console.log("Google OAuth initiated:", data);
      }
    } catch (e: any) {
      console.error("Google OAuth threw:", e);
      setMsg(e?.message ?? "Google sign-in failed");
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 rounded-2xl shadow border bg-white space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
            {mode === "signup" ? "New workspace" : "Existing account"}
          </p>
          <h1 className="text-2xl font-semibold">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Sign in to save your CV feedback history and keep drafts in one
            place.
          </p>
        </div>
        <span className="px-2 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
          Beta
        </span>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        {mode === "signup" && (
          <input
            className="w-full border rounded p-2"
            placeholder="Full name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          className="w-full border rounded p-2"
          placeholder="email@example.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <input
          className="w-full border rounded p-2"
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />
        <p className="text-xs text-gray-500">
          Use 8+ characters. You can update your details after signing in.
        </p>
        <button
          type="submit"
          disabled={loading || googleLoading}
          className="w-full rounded-2xl p-2 border bg-black text-white disabled:opacity-60"
        >
          {loading
            ? "Working..."
            : mode === "signup"
            ? "Sign up with email"
            : "Sign in with email"}
        </button>
      </form>

      <div className="my-4 text-center text-sm text-gray-500">or</div>

      <button
        onClick={google}
        disabled={loading || googleLoading || supabaseUnavailable}
        className="w-full rounded-2xl p-2 border disabled:opacity-60"
        aria-label="Continue with Google"
      >
        {googleLoading
          ? "Opening Google..."
          : supabaseUnavailable
          ? "Google sign-in unavailable"
          : "Continue with Google"}
      </button>

      {supabaseUnavailable && (
        <p className="mt-2 text-xs text-red-500">
          Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable Google
          sign-in.
        </p>
      )}

      {msg && (
        <p className="mt-3 text-sm rounded-xl border bg-gray-50 p-3">
          {msg}
        </p>
      )}

      <div className="p-4 rounded-xl border bg-gray-50 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-800">What you'll unlock</span>
          <span className="text-xs px-2 py-1 rounded-full bg-white border text-gray-600">
            1 min setup
          </span>
        </div>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>Keep your CV feedback history in one place</li>
          <li>Revisit drafts without re-uploading files</li>
          <li>Use Google to skip typing credentials next time</li>
        </ul>
      </div>
    </div>
  );
}
