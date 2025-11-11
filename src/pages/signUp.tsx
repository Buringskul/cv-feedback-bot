// src/pages/signup.tsx
import AuthForm from "../components/AuthForm";
import { Link } from "react-router-dom";

export default function SignUpPage() {
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-md">
        <AuthForm mode="signup" />
        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/signin" className="underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
