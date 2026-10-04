import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin sign in | Aashi Sharma",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const nextPath = params.next?.startsWith("/admin/")
    ? params.next
    : "/admin";

  return (
    <main className="min-h-screen bg-brand-50 px-4 py-20 text-brand-900">
      <div className="mx-auto max-w-md rounded-3xl border border-brand-100 bg-white p-6 shadow-xl shadow-brand-100/60 sm:p-9">
        <Link
          href="/"
          className="text-xs font-bold uppercase tracking-widest text-brand-600 hover:text-brand-800"
        >
          ← Back to portfolio
        </Link>
        <p className="mt-8 text-xs font-bold uppercase tracking-widest text-brand-600">
          Private area
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold">Admin sign in</h1>
        <p className="mt-3 text-sm leading-relaxed text-brand-700">
          Sign in with an approved Aashi Sharma portfolio account.
        </p>
        {params.error === "not-admin" && (
          <p className="mt-4 rounded-xl bg-brand-50 p-3 text-sm text-brand-800" role="alert">
            This account is not on the portfolio admin allowlist.
          </p>
        )}
        <LoginForm nextPath={nextPath} />
      </div>
    </main>
  );
}
