"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      redirect: false,
      email: form.get("email"),
      password: form.get("password")
    });
    setLoading(false);
    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push("/admin");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md rounded-xl border border-black/10 bg-white p-7">
        <h1 className="mb-6 text-2xl font-semibold text-primary">Admin Login</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <input name="email" placeholder="Email" className="h-11 w-full rounded-md border px-3" required />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="h-11 w-full rounded-md border px-3"
            required
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button type="submit" disabled={loading} className="h-11 w-full rounded-md bg-primary text-sm font-semibold text-white">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="mt-4 text-xs text-primary/60">Demo: admin@xylem.com / xylem2024</p>
      </div>
    </main>
  );
}
