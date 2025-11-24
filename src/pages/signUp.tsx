import AuthForm from "../components/AuthForm";
import { Link } from "react-router-dom";

export default function SignUpPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">

      {/* 🔥 Gradient Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br 
                      from-primary/20 via-accent/20 to-primary-glow/20 
                      animate-gradient-xy" />

      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/30 rounded-full blur-[120px]" />

      {/* Card */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 
                      p-10 rounded-3xl shadow-2xl w-full max-w-md 
                      animate-fade-in">

        <h1 className="text-3xl font-bold text-center mb-6
                       bg-gradient-to-r from-primary to-accent 
                       bg-clip-text text-transparent">
          Create Your Account
        </h1>

        <AuthForm mode="signup" />

        <p className="mt-4 text-center text-sm text-gray-200">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="underline text-accent hover:text-primary transition"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
