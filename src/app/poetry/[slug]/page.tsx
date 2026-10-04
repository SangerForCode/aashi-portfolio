import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/sections/Footer";
import Nav from "@/components/Nav";
import PoemText from "@/components/content/PoemText";
import { DEFAULT_HOME_CONTENT } from "@/lib/content/home";
import { formatPoemDate } from "@/lib/content/poem-formatting";
import { getPublishedPoem } from "@/lib/content/poems";

export const dynamic = "force-dynamic";

type PoemPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PoemPageProps): Promise<Metadata> {
  const { slug } = await params;
  const poem = await getPublishedPoem(slug);
  if (!poem) return { title: "Poem not found | Aashi Sharma" };

  const description =
    poem.excerpt ?? poem.content.replace(/\s+/g, " ").slice(0, 160);

  return {
    title: `${poem.title} | Aashi Sharma`,
    description,
    openGraph: {
      title: poem.title,
      description,
      type: "article",
      images: [
        {
          url: "/aashi.jpeg",
          alt: "Aashi Sharma",
        },
      ],
    },
  };
}

export default async function PoemDetailPage({ params }: PoemPageProps) {
  const { slug } = await params;
  const poem = await getPublishedPoem(slug);
  if (!poem) notFound();

  return (
    <>
      <Nav brandName="Aashi Sharma" homePrefix="/" />
      <main className="min-h-screen bg-brand-50 px-4 pb-20 pt-32 text-brand-900 sm:px-6">
        <article className="mx-auto max-w-3xl">
          <Link
            href="/poetry"
            className="text-xs font-bold uppercase tracking-widest text-brand-600 hover:text-brand-800"
          >
            ← All poems
          </Link>
          <header className="mt-8 border-b border-brand-200 pb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
              Aashi Sharma
            </p>
            <h1 className="mt-3 font-serif text-3xl font-bold leading-tight text-brand-900 sm:text-5xl">
              {poem.title}
            </h1>
            {poem.published_at && (
              <p className="mt-4 text-xs uppercase tracking-widest text-brand-500">
                {formatPoemDate(poem.published_at)}
              </p>
            )}
          </header>

          <PoemText
            content={poem.content}
            className="mx-auto mt-10 max-w-xl space-y-8 font-serif text-lg leading-8 text-brand-800 sm:text-xl sm:leading-9"
          />

          {poem.tags.length > 0 && (
            <ul className="mt-12 flex flex-wrap justify-center gap-2" aria-label="Poem tags">
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
        </article>
      </main>
      <Footer brandName="Aashi Sharma" content={DEFAULT_HOME_CONTENT} />
    </>
  );
}
