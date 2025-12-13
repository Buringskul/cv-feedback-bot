import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface AuthFormProps {
  title: string;
  submitLabel: string;
  onSubmit: (email: string, password: string) => Promise<void> | void;
}

export const AuthForm = ({
  title,
  submitLabel,
  onSubmit,
}: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(email, password);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      role="main"
    >
      <Card className="w-full max-w-md p-6">
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          aria-labelledby="auth-form-title"
        >
          <h1
            id="auth-form-title"
            className="text-2xl font-semibold text-center"
          >
            {title}
          </h1>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              autoComplete="current-password"
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? "Please wait…" : submitLabel}
          </Button>
        </form>
      </Card>
    </main>
  );
};
