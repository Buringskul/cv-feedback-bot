// src/pages/signUp.tsx
import { Link } from "react-router-dom";
import { AuthForm } from "../components/AuthForm";

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 px-4">
      <div className="bg-white rounded-xl shadow-xl px-6 py-5 w-full max-w-md">
        {/* Title */}
        <h1 className="text-lg font-semibold text-center mb-4">
          Register
        </h1>

        {/* Form */}
        <AuthForm mode="signup" />

        {/* Bottom navigation */}
        <div className="flex justify-between text-sm text-gray-500 mt-4">
          <Link to="/" className="hover:text-gray-900">
            Home
          </Link>
          <Link to="/signin" className="hover:text-gray-900">
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
