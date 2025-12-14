import AuthForm from "../components/AuthForm";
import { Link } from "react-router-dom";

export default function SignInPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-10 overflow-hidden">

      {/* 🌌 Navy + Green Background */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-br 
        from-[#0F172A]/85 via-[#1E293B]/75 to-[#0F172A]/85
        animate-gradient-xy"
      />

      {/* Subtle Glowing Blobs */}
      <div className="absolute top-[-6rem] left-[-6rem] w-[35rem] h-[35rem] bg-[#10B981]/25 rounded-full blur-[170px]" />
      <div className="absolute bottom-[-6rem] right-[-6rem] w-[35rem] h-[35rem] bg-[#34D399]/25 rounded-full blur-[170px]" />

      {/* CARD */}
      <div
        className="
          backdrop-blur-xl bg-[#0F172A]/40 border border-[#10B981]/20
          p-16 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.45)]
          w-full max-w-4xl
          animate-fade-in
        "
      >

        {/* Logo + Title */}
        <div className="flex flex-col items-center mb-12 animate-fade-in">
          <img
            src="/src/assets/logo.png"
            alt="TailorMyCV Logo"
            className="w-32 h-32 rounded-2xl shadow-xl mb-6"
          />

          <h1
            className="
              text-6xl font-extrabold tracking-tight
              bg-gradient-to-r from-[#10B981] to-[#34D399]
              bg-clip-text text-transparent drop-shadow-lg
            "
          >
            TailorMyCV
          </h1>
        </div>

        {/* AUTH FORM */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <AuthForm mode="signin" />
          </div>
        </div>

        {/* Create Account */}
        <p className="mt-10 text-center text-xl text-white/70">
          New here?{" "}
          <Link
            to="/signup"
            className="underline text-[#34D399] hover:text-[#10B981] transition font-semibold"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
