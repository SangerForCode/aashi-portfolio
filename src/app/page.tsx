import About from "@/components/sections/About";
import ClinicalMatcher from "@/components/sections/ClinicalMatcher";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Hero";
import PoetrySection from "@/components/sections/PoetrySection";
import Research from "@/components/sections/Research";
import Nav from "@/components/Nav";
import { getHomePageData } from "@/lib/content/home";
import { getSiteUrl } from "@/lib/site-url";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getHomePageData();
  const name = settings.brand_name;
  const title = `${name} | ${settings.tagline}`;
  const description = `Portfolio of ${name}, B.A. Applied Psychology (Hons with Research) at Amity University, focused on attachment, emotional regulation, and adult codependency.`;

  return {
    title,
    description,
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description,
      url: getSiteUrl(),
      type: "website",
      images: [{ url: "/aashi.jpeg", alt: `Portrait of ${name}` }],
    },
  };
}

export default async function Home() {
  const data = await getHomePageData();
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: data.settings.brand_name,
    jobTitle: "Aspiring Clinical Psychologist & Mental Health Researcher",
    description: data.settings.tagline,
    url: getSiteUrl().toString(),
    image: new URL("/aashi.jpeg", getSiteUrl()).toString(),
    sameAs: [data.settings.linkedin_url].filter(Boolean),
  };
  const serializedPerson = JSON.stringify(personJsonLd).replace(/</g, "\\u003c");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializedPerson }}
      />
      <Nav brandName={data.settings.brand_name} />
      <main id="top">
        <Hero content={data.content} />
        <About content={data.content} />
        <Research content={data.content} project={data.research} />
        <ClinicalMatcher
          duties={data.clinicalDuties}
          content={data.content}
        />
        <Contact content={data.content} links={data.contactLinks} />
        <PoetrySection />
      </main>
      <Footer brandName={data.settings.brand_name} content={data.content} />
    </>
  );
}
