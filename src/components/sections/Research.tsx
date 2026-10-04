import ResearchModal from "@/components/sections/ResearchModal";
import type {
  HomeContent,
  ResearchProject,
} from "@/lib/content/home";

export default function Research({
  content,
  project,
}: {
  content: HomeContent;
  project: ResearchProject;
}) {
  return (
    <section
      id="research"
      className="py-16 sm:py-24 px-4 sm:px-6 bg-brand-100/30 border-y border-brand-100 relative z-10"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/80 rounded-full text-xs font-semibold border border-brand-200 text-brand-700">
              <span>{content["research.badge"]}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-900 leading-tight">
              {project.title}
            </h2>

            <p className="text-brand-800 text-sm leading-relaxed">
              {project.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-brand-100">
              <div>
                <p className="text-xs font-bold text-brand-500 uppercase tracking-widest">
                  Project Focus
                </p>
                <p className="text-sm font-semibold text-brand-800">
                  {project.project_focus}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-brand-500 uppercase tracking-widest">
                  Supervisor
                </p>
                <p className="text-sm font-semibold text-brand-800">
                  {project.supervisor}
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <ResearchModal content={content} project={project} />
              <a
                href={project.pdf_path}
                download
                className="px-6 py-3.5 bg-white hover:bg-brand-100 text-brand-800 border border-brand-200 font-semibold text-sm rounded-xl transition-all flex items-center justify-center space-x-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span>Download Full PDF Source</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl border border-brand-200/60 p-5 sm:p-8 shadow-xl shadow-brand-100/50 space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pb-4 border-b border-brand-100">
                <h3 className="font-serif font-bold text-lg text-brand-900">
                  {content["research.highlights_title"]}
                </h3>
                <span className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">
                  {content["research.draft_label"]}
                </span>
              </div>

              <div className="space-y-4">
                {project.highlights.map((highlight) => (
                  <div
                    key={highlight.title}
                    className="p-4 rounded-2xl bg-brand-50/50 border border-brand-100/50"
                  >
                    <h4 className="text-xs font-bold text-brand-800 uppercase tracking-widest mb-1">
                      {highlight.title}
                    </h4>
                    <p className="text-xs text-brand-700 leading-relaxed">
                      {highlight.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
