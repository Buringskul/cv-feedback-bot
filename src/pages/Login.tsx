import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateForm = () => {
    setError("");
    setSuccess("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }

    setSuccess("Login details are valid!");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateForm();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 px-4 animate-fade-in relative">

      {/* 🔵 Home Button - Top Right */}
      <Link
        to="/"
        className="absolute top-6 right-6 text-blue-600 hover:underline font-medium"
      >
        Home
      </Link>

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          Login
        </h2>

        <form role="form" onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded shadow-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 text-sm text-green-700 bg-green-100 rounded shadow-sm">
              {success}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
          >
            Login
          </button>
        </form>

        {/* 🔵 Don't have an account? */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">Don’t have an account yet?</p>
          <Link
            to="/register"
            className="mt-1 inline-block text-blue-600 hover:underline font-medium"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
