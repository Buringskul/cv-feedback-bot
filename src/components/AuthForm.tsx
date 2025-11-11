// src/components/AuthForm.tsx
import { useState } from "react";
import { api } from "../integrations/api/client";
import { supabase } from "../integrations/supabase/client";

type Mode = "signup" | "signin";

export default function AuthForm({ mode }: { mode: Mode }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  

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
    setMsg(null);
    setGoogleLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
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
    <div className="max-w-sm mx-auto p-6 rounded-2xl shadow border">
      <h1 className="text-2xl font-semibold mb-4">
        {mode === "signup" ? "Create your account" : "Welcome back"}
      </h1>

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
        disabled={loading || googleLoading}
        className="w-full rounded-2xl p-2 border disabled:opacity-60"
        aria-label="Continue with Google"
      >
        {googleLoading ? "Opening Google..." : "Continue with Google"}
      </button>

      {msg && <p className="mt-3 text-sm">{msg}</p>}
    </div>
  );
}
