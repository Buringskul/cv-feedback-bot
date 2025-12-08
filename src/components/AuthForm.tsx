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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        await api.register(email, password, name || undefined);
        setMsg("🎉 Account created! You can sign in now.");
      } else {
        const r = await api.login(email, password);
        localStorage.setItem("auth_token", r.token);
        localStorage.setItem("auth_user", JSON.stringify(r.user));
        window.location.href = "/";
      }
    } catch (err: any) {
      setMsg(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    setMsg(null);
    setGoogleLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin },
      });

      if (error) setMsg(error.message);
    } catch (e: any) {
      setMsg(e?.message ?? "Google sign-in failed");
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div
      className="
        w-full max-w-md mx-auto p-8 
        rounded-2xl backdrop-blur-xl 
        bg-[#0F172A]/70 border border-[#334155]
        shadow-[0_0_25px_rgba(0,0,0,0.35)]
      "
    >
      {/* Header */}
      <h1
        className="text-3xl font-extrabold text-center mb-8
          bg-gradient-to-r from-[#10B981] to-[#34D399]
          bg-clip-text text-transparent"
      >
        {mode === "signup" ? "Create Account" : "Welcome Back"}
      </h1>

      {/* FORM */}
      <form onSubmit={onSubmit} className="space-y-4">

        {mode === "signup" && (
          <input
            className="
              w-full p-3 rounded-lg 
              bg-[#1E293B] text-white placeholder-white/40
              border border-[#334155] text-base
              focus:outline-none focus:ring-2 focus:ring-[#10B981]
            "
            placeholder="Full name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          className="
            w-full p-3 rounded-lg 
            bg-[#1E293B] text-white placeholder-white/40
            border border-[#334155] text-base
            focus:outline-none focus:ring-2 focus:ring-[#10B981]
          "
          placeholder="email@example.com"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="
            w-full p-3 rounded-lg 
            bg-[#1E293B] text-white placeholder-white/40
            border border-[#334155] text-base
            focus:outline-none focus:ring-2 focus:ring-[#10B981]
          "
          placeholder="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || googleLoading}
          className="
            w-full p-3 rounded-lg font-semibold text-[#0F172A]
            bg-gradient-to-r from-[#10B981] to-[#34D399]
            shadow-md shadow-[#10B981]/30 text-base
            disabled:opacity-60 transition hover:scale-[1.02]
          "
        >
          {loading
            ? "Working..."
            : mode === "signup"
            ? "Sign up"
            : "Sign in"}
        </button>
      </form>

      {/* Divider */}
      <div className="my-6 text-center text-white/50 text-sm">or</div>

      {/* Google Sign-In */}
      <button
        onClick={google}
        disabled={loading || googleLoading}
        className="
          w-full p-3 rounded-lg text-base font-medium
          bg-[#1E293B] border border-[#334155] text-white
          hover:bg-[#233445] transition disabled:opacity-60
        "
      >
        {googleLoading ? "Opening Google..." : "Continue with Google"}
      </button>

      {/* Status Message */}
      {msg && (
        <p className="mt-5 text-center text-sm text-[#34D399]">
          {msg}
        </p>
      )}
    </div>
  );
}
