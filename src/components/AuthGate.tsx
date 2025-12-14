import { Link } from "react-router-dom";

export default function AuthGate() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 px-4">
      <div className="bg-card border rounded-2xl shadow-lg p-8 max-w-md w-full text-center space-y-6">
        <h1 className="text-2xl font-semibold">
          Sign in to view your results
        </h1>

        <p className="text-muted-foreground">
          Create an account or sign in to access your CV analysis and insights.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            to="/signin"
            className="px-5 py-2 rounded-md border border-border hover:bg-muted transition"
          >
            Sign In
          </Link>

          <Link
            to="/signup"
            className="px-5 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
          >
            Register
          </Link>
        </div>

        <Link
          to="/"
          className="block text-sm text-muted-foreground hover:underline"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
