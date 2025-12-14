import AuthForm from "../components/AuthForm";
import { Link } from "react-router-dom";

export default function SignUpPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-10 overflow-hidden">

      {/* 🌌 Navy + Green Background */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-br
        from-[#0F172A]/85 via-[#1E293B]/75 to-[#0F172A]/85
        animate-gradient-xy"
      />

      {/* Glowing Green Blobs */}
      <div className="absolute top-[-7rem] right-[-7rem] w-[38rem] h-[38rem] bg-[#10B981]/25 rounded-full blur-[180px]" />
      <div className="absolute bottom-[-7rem] left-[-7rem] w-[38rem] h-[38rem] bg-[#34D399]/25 rounded-full blur-[180px]" />

      {/* CARD */}
      <div
        className="
          backdrop-blur-xl bg-[#0F172A]/40  border border-[#34D399]/15
          p-16 rounded-3xl shadow-[0_10px_60px_rgba(0,0,0,0.45)]
          w-full max-w-4xl
          animate-fade-in
        "
      >

        {/* Logo + Title */}
        <div className="flex flex-col items-center mb-14">
          <img
            src="/src/assets/logo.png"
            alt="TailorMyCV Logo"
            className="w-28 h-28 rounded-2xl shadow-xl mb-5"
          />

          <h1
            className="
              text-5xl font-extrabold tracking-tight
              bg-gradient-to-r from-[#10B981] to-[#34D399]
              bg-clip-text text-transparent
            "
          >
            TailorMyCV
          </h1>
        </div>

        {/* AUTH FORM */}
        <div className="max-w-md mx-auto">
          <AuthForm mode="signup" />
        </div>

        {/* Already have account */}
        <p className="mt-10 text-center text-xl text-white/75">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="underline text-[#34D399] hover:text-[#10B981] transition font-semibold"
          >
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}
