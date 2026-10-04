"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm({ nextPath }: { nextPath: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const { error: authError } = await createClient().auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) {
        setError("Unable to sign in with those credentials.");
        setIsSubmitting(false);
        return;
      }

      const destination = nextPath.startsWith("/admin/") ? nextPath : "/admin";
      // A full navigation lets mobile browsers send the newly written auth
      // cookies through middleware before loading the protected admin pages.
      window.location.assign(destination);
    } catch {
      setError("Unable to connect right now. Check your connection and try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={signIn} className="mt-7 space-y-5">
      <label className="block text-sm font-semibold text-brand-800">
        Email
        <input
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 min-h-12 w-full rounded-xl border border-brand-200 px-4 py-3 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 sm:text-sm"
        />
      </label>
      <label className="block text-sm font-semibold text-brand-800">
        Password
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 min-h-12 w-full rounded-xl border border-brand-200 px-4 py-3 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 sm:text-sm"
        />
      </label>
      {error && (
        <p role="alert" className="text-sm font-medium text-red-700">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="min-h-12 w-full rounded-xl bg-brand-600 px-5 py-3.5 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-60"
      >
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
