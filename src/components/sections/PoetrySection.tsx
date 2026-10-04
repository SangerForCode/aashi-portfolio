import Link from "next/link";
import PoemInlineText from "@/components/content/PoemInlineText";
import { formatPoemDate, splitPoemStanzas } from "@/lib/content/poem-formatting";
import { getPublishedPoems } from "@/lib/content/poems";

export default async function PoetrySection() {
  const poems = await getPublishedPoems();

  if (poems.length === 0) return null;

  return (
    <section
      id="poetry"
      className="relative z-10 border-y border-brand-100 bg-brand-100/30 px-4 py-16 sm:px-6 sm:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-5 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
              Personal writing
            </span>
            <h2 className="font-serif text-3xl font-bold text-brand-900 sm:text-4xl">
              Poetry
            </h2>
            <p className="text-sm leading-relaxed text-brand-800">
              Poems and reflections by Aashi.
            </p>
          </div>
          <Link
            href="/poetry"
            className="inline-flex w-fit items-center rounded-xl border border-brand-200 bg-white px-5 py-3 text-sm font-semibold text-brand-800 transition-colors hover:bg-brand-50"
          >
            Explore all poems <span aria-hidden="true" className="ml-2">→</span>
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {poems.map((poem) => {
            const excerpt = poem.excerpt ?? splitPoemStanzas(poem.content)[0] ?? "";

            return (
              <article
                key={poem.id}
                className="flex h-full flex-col rounded-3xl border border-brand-200/60 bg-white p-6 shadow-sm sm:p-7"
              >
                <h3 className="font-serif text-xl font-bold leading-snug text-brand-900">
                  {poem.title}
                </h3>
                {poem.published_at && (
                  <p className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-brand-500">
                    {formatPoemDate(poem.published_at)}
                  </p>
                )}
                <p className="mt-5 line-clamp-5 flex-1 whitespace-pre-wrap font-serif text-sm leading-relaxed text-brand-800">
                  <PoemInlineText text={excerpt} />
                </p>
                <Link
                  href={`/poetry/${poem.slug}`}
                  className="mt-6 inline-flex text-sm font-semibold text-brand-600 hover:text-brand-800"
                >
                  Read poem <span aria-hidden="true" className="ml-1">→</span>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
