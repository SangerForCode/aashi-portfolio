import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/sections/Footer";
import Nav from "@/components/Nav";
import PoemInlineText from "@/components/content/PoemInlineText";
import { DEFAULT_HOME_CONTENT } from "@/lib/content/home";
import {
  formatPoemDate,
  splitPoemStanzas,
} from "@/lib/content/poem-formatting";
import { getPublishedPoems } from "@/lib/content/poems";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Poetry | Aashi Sharma",
  description: "Poems by Aashi Sharma.",
};

export default async function PoetryPage() {
  const poems = await getPublishedPoems();

  return (
    <>
      <Nav brandName="Aashi Sharma" homePrefix="/" />
      <main className="min-h-screen bg-brand-50 px-4 pb-20 pt-32 text-brand-900 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/#top"
            className="text-xs font-bold uppercase tracking-widest text-brand-600 hover:text-brand-800"
          >
            ← Portfolio
          </Link>
          <header className="mt-8 border-b border-brand-200 pb-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
              Aashi Sharma
            </p>
            <h1 className="mt-3 font-serif text-4xl font-bold text-brand-900 sm:text-5xl">
              Poetry
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-brand-800">
              Selected writing and reflections.
            </p>
            <Link
              href="/admin/login"
              className="mt-6 inline-flex items-center rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand-200 transition-colors hover:bg-brand-700"
            >
              Admin Login
            </Link>
          </header>

          {poems.length ? (
            <div className="divide-y divide-brand-200">
              {poems.map((poem) => (
                <article key={poem.id} className="py-8 sm:py-10">
                  <Link
                    href={`/poetry/${poem.slug}`}
                    className="group inline-block"
                  >
                    <h2 className="font-serif text-2xl font-bold text-brand-900 transition-colors group-hover:text-brand-600 sm:text-3xl">
                      {poem.title}
                    </h2>
                  </Link>
                  {poem.published_at && (
                    <p className="mt-2 text-xs uppercase tracking-widest text-brand-500">
                      {formatPoemDate(poem.published_at)}
                    </p>
                  )}
                  {(poem.excerpt || poem.content) && (
                    <p className="mt-4 max-w-2xl whitespace-pre-wrap font-serif text-base leading-relaxed text-brand-800">
                      <PoemInlineText
                        text={poem.excerpt ?? splitPoemStanzas(poem.content)[0]}
                      />
                    </p>
                  )}
                  {poem.tags.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2" aria-label="Poem tags">
                      {poem.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full border border-brand-200 bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-700"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link
                    href={`/poetry/${poem.slug}`}
                    className="mt-5 inline-flex text-sm font-semibold text-brand-600 hover:text-brand-800"
                  >
                    Read poem <span aria-hidden="true" className="ml-1">→</span>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-10 rounded-3xl border border-brand-100 bg-white p-8 font-serif text-lg text-brand-700">
              Poetry will appear here soon.
            </p>
          )}
        </div>
      </main>
      <Footer
        brandName="Aashi Sharma"
        content={DEFAULT_HOME_CONTENT}
      />
    </>
  );
}
