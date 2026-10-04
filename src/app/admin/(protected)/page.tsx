import Link from "next/link";

const sections = [
  { href: "/admin/content", title: "Page copy", description: "Edit public and private site text." },
  { href: "/admin/research", title: "Research", description: "Manage term paper details and highlights." },
  { href: "/admin/clinical", title: "Clinical matcher", description: "Edit duties, alignment copy, and publication state." },
  { href: "/admin/poems", title: "Poems", description: "Write, save drafts, and publish poems." },
  { href: "/admin/settings", title: "Settings & contact", description: "Manage public settings and contact links." },
];

export default function AdminDashboard() {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-brand-600">
        Content management
      </p>
      <h1 className="mt-2 font-serif text-3xl font-bold">Portfolio dashboard</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-700">
        Manage the content shown on the public portfolio. Database policies remain the authority for all reads and writes.
      </p>
      <div className="mt-7 grid gap-4 md:grid-cols-2">
        {sections.map(({ href, title, description }) => (
          <Link
            key={href}
            href={href}
            className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm transition-colors hover:border-brand-200 hover:bg-brand-50/50"
          >
            <h2 className="font-serif text-xl font-bold text-brand-900">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-700">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
