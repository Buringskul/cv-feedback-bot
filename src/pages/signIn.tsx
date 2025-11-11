// src/pages/signin.tsx
import AuthForm from "../components/AuthForm";
import { Link } from "react-router-dom";

export default function SignInPage() {
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-md">
        <AuthForm mode="signin" />
        <p className="mt-4 text-center text-sm">
          New here?{" "}
          <Link to="/signup" className="underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
