"use client";

import { useEffect, useState } from "react";
import type {
  HomeContent,
  ResearchProject,
} from "@/lib/content/home";

export default function ResearchModal({
  content,
  project,
}: {
  content: HomeContent;
  project: ResearchProject;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
        aria-haspopup="dialog"
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
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
        <span>Read Term Paper Abstract</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-brand-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="research-modal-title"
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-5 sm:p-6 md:p-10 shadow-2xl relative"
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close research abstract"
              className="absolute top-5 right-5 sm:top-6 sm:right-6 text-brand-900 hover:text-brand-500 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-brand-600 bg-brand-100 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                  Research Abstract Preview
                </span>
                <h2
                  id="research-modal-title"
                  className="font-serif text-2xl md:text-3xl font-bold text-brand-900 mt-4 leading-snug"
                >
                  {project.title}
                </h2>
                <div className="w-12 h-1 bg-brand-300 rounded-full my-4" />
              </div>

              <div className="space-y-4 text-sm text-brand-800 leading-relaxed border-t border-brand-100 pt-6">
                <p className="font-bold text-brand-900">
                  {content["research.modal_background_title"]}
                </p>
                <p>
                  {content["research.modal_background"]}
                </p>
                <p className="font-bold text-brand-900">
                  {content["research.modal_summary_title"]}
                </p>
                <p>
                  {project.abstract}
                </p>
                <p className="font-bold text-brand-900">
                  {content["research.modal_method_title"]}
                </p>
                <p>
                  {content["research.modal_method"]}
                </p>
                <p className="font-bold text-brand-900">
                  {content["research.modal_supervision_title"]}
                </p>
                <p>
                  {content["research.modal_supervision"]}
                </p>
              </div>

              <div className="pt-6 border-t border-brand-50 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2.5 bg-brand-900 text-white text-xs font-semibold rounded-xl hover:bg-brand-800 transition-colors"
                >
                  Close Reader
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
