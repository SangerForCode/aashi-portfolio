import Link from "next/link";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/admin/LogoutButton";
import FlowerIcon from "@/components/FlowerIcon";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const adminLinks = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/content", label: "Page copy" },
  { href: "/admin/research", label: "Research" },
  { href: "/admin/clinical", label: "Clinical matcher" },
  { href: "/admin/poems", label: "Poems" },
  { href: "/admin/settings", label: "Settings & contact" },
];

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: admin } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!admin) redirect("/admin/login?error=not-admin");

  return (
    <div className="min-h-screen bg-brand-50 text-brand-900">
      <header className="border-b border-brand-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center text-brand-700">
              <FlowerIcon />
            </span>
            <span className="font-serif text-lg font-bold">Aashi Sharma CMS</span>
          </Link>
          <div className="flex items-center justify-between gap-4">
            <span className="max-w-[14rem] truncate text-xs text-brand-700">
              {user.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[13rem_minmax(0,1fr)] lg:py-10">
        <nav
          aria-label="Admin sections"
          className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible"
        >
          {adminLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="shrink-0 rounded-xl border border-brand-100 bg-white px-4 py-3 text-sm font-semibold text-brand-800 transition-colors hover:border-brand-200 hover:bg-brand-100/40"
            >
              {label}
            </Link>
          ))}
        </nav>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
