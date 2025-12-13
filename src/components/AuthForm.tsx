// src/components/AuthForm.tsx
export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  return (
    <form className="space-y-4">
      {/* Email */}
      <div className="grid grid-cols-3 items-center gap-3">
        <label className="text-sm font-medium col-span-1">
          Email address
        </label>
        <input
          type="email"
          className="col-span-2 rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      {/* Password */}
      <div className="grid grid-cols-3 items-center gap-3">
        <label className="text-sm font-medium col-span-1">
          Password
        </label>
        <input
          type="password"
          className="col-span-2 rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full mt-4 rounded-md bg-primary text-primary-foreground py-2 font-medium hover:opacity-90 transition"
      >
        {mode === "signin" ? "Sign In" : "Register"}
      </button>
    </form>
  );
}
