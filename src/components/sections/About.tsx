import type { HomeContent } from "@/lib/content/home";

export default function About({ content }: { content: HomeContent }) {
  const interests = Array.from({ length: 6 }, (_, index) =>
    content[`about.interest_${index + 1}`],
  );

  return (
    <section
      id="about"
      className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto z-10 relative border-t border-brand-100"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-4 space-y-4">
          <span className="text-xs font-bold tracking-widest text-brand-600 uppercase">
            {content["about.eyebrow"]}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-900 leading-tight">
            {content["about.heading"]}
          </h2>
          <div className="w-12 h-1 bg-brand-300 rounded-full mt-4" />
        </div>

        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-brand-800">
              {content["about.approach_title"]}
            </h3>
            <p className="text-sm text-brand-900 leading-relaxed">
              {content["about.approach_1"]}
            </p>
            <p className="text-sm text-brand-900 leading-relaxed">
              {content["about.approach_2"]}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-brand-100 space-y-4 shadow-sm">
            <h4 className="text-xs font-bold tracking-widest text-brand-600 uppercase">
              {content["about.interests_title"]}
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              {interests.filter(Boolean).map((interest) => (
                <span
                  key={interest}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-brand-50 text-brand-800 border border-brand-200/50"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
