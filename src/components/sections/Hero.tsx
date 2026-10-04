import type { HomeContent } from "@/lib/content/home";

export default function Hero({ content }: { content: HomeContent }) {
  const title = content["hero.title"];
  const emphasizedTitle = "clinical empathy";
  const titleParts = title.split(emphasizedTitle);

  return (
    <section className="relative min-h-screen flex items-center px-4 sm:px-6 pt-28 md:pt-32 pb-14 md:pb-16 max-w-7xl mx-auto z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center w-full">
        {/* Left Narrative */}
        <div className="lg:col-span-7 lg:row-start-1 space-y-5 sm:space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-200/40 text-brand-700 border border-brand-200/50">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            <span>{content["hero.badge"]}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-brand-900 font-bold leading-tight mobile-text-balance">
            {titleParts.length === 2 ? (
              <>
                {titleParts[0]}
                <span className="text-brand-500">{emphasizedTitle}</span>
                {titleParts[1]}
              </>
            ) : (
              title
            )}
          </h1>

          <p className="text-brand-800 text-sm sm:text-lg leading-relaxed max-w-2xl">
            {content["hero.intro"]}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <a
              href="#research"
              className="px-6 py-3.5 text-center rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-200/50 transition-all"
            >
              {content["hero.cta_details"]}
            </a>
            <a
              href="#matcher"
              className="px-6 py-3.5 text-center rounded-xl bg-white hover:bg-brand-100/40 text-brand-800 border border-brand-200 font-semibold text-sm transition-all"
            >
              {content["hero.cta_alignment"]}
            </a>
          </div>
        </div>

        {/* Right Hand Portrait */}
        <div className="order-2 lg:order-none lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 flex flex-col items-center justify-center relative">
          <div className="relative w-full max-w-[18rem] sm:max-w-sm aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white group hover:scale-[1.01] transition-transform duration-500">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/aashi.jpeg"
              alt={`Portrait of ${content["hero.portrait_name"]}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-900/65 via-brand-900/15 to-brand-50/10 flex flex-col justify-between p-5 sm:p-8 text-white">
              <div className="flex justify-between items-center w-full">
                <span className="text-[10px] font-bold tracking-widest text-brand-900 uppercase bg-white/85 px-2.5 py-1 rounded-full border border-brand-100">
                  Official Portrait
                </span>
                <div className="w-3 h-3 rounded-full bg-brand-100" />
              </div>

              <div className="mt-auto pt-4 flex flex-col items-center text-center space-y-2">
                <div>
                  <h3 className="font-serif font-bold text-xl text-white drop-shadow">
                    {content["hero.portrait_name"]}
                  </h3>
                  <p className="text-xs text-brand-100 mt-1">
                    {content["hero.portrait_degree"]}
                  </p>
                  <p className="text-[11px] text-brand-100/90 italic mt-0.5">
                    {content["hero.portrait_university"]}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-brand-200/50 rounded-full mix-blend-multiply filter blur-2xl opacity-70" />
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-brand-300/40 rounded-full mix-blend-multiply filter blur-2xl opacity-70" />
        </div>

        {/* Academic Credentials Grid */}
        <div className="order-3 lg:order-none lg:col-span-7 lg:row-start-2 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-brand-100 max-w-lg">
          <div>
            <p className="text-xl font-serif font-bold text-brand-700">{content["hero.stat_year"]}</p>
            <p className="text-[10px] text-brand-800 uppercase tracking-widest font-bold mt-1">
              {content["hero.stat_year_label"]}
            </p>
          </div>
          <div>
            <p className="text-xl font-serif font-bold text-brand-700">{content["hero.stat_batch"]}</p>
            <p className="text-[10px] text-brand-800 uppercase tracking-widest font-bold mt-1">
              {content["hero.stat_batch_label"]}
            </p>
          </div>
          <div>
            <p className="text-xl font-serif font-bold text-brand-700">{content["hero.stat_focus"]}</p>
            <p className="text-[10px] text-brand-800 uppercase tracking-widest font-bold mt-1">
              {content["hero.stat_focus_label"]}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
