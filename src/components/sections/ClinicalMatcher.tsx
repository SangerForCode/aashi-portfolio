"use client";

import { useState } from "react";
import type { ClinicalDuty, HomeContent } from "@/lib/content/home";

export default function ClinicalMatcher({
  duties,
  content,
}: {
  duties: ClinicalDuty[];
  content: HomeContent;
}) {
  const [selectedDuty, setSelectedDuty] = useState(duties[0]?.key ?? "screening");
  const duty = duties.find(({ key }) => key === selectedDuty) ?? duties[0];

  if (!duty) return null;

  return (
    <section
      id="matcher"
      className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto z-10 relative"
    >
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16 space-y-4">
        <span className="text-xs font-bold tracking-widest text-brand-600 uppercase">
          {content["clinical.eyebrow"]}
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-900 mobile-text-balance">
          {content["clinical.heading"]}
        </h2>
        <div className="w-16 h-1 bg-brand-300 mx-auto rounded-full" />
        <p className="text-brand-800 text-sm">
          {content["clinical.description"]}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-5 space-y-3" aria-label="Clinical duties">
          {duties.map(({ key, label }) => {
            const isSelected = selectedDuty === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedDuty(key)}
                aria-pressed={isSelected}
                className={`w-full text-left p-4 rounded-xl ${
                  isSelected
                    ? "border-2 border-brand-400 bg-white shadow-md"
                    : "border border-brand-200/60 bg-white/60 hover:bg-white hover:shadow-sm"
                } transition-all duration-200 flex items-center justify-between group`}
              >
                <span className="text-sm font-semibold text-brand-900">
                  {label}
                </span>
                <span className="w-6 h-6 rounded-full bg-brand-200 text-brand-700 flex items-center justify-center text-xs">
                  ➔
                </span>
              </button>
            );
          })}
        </div>

        <div
          className="lg:col-span-7 bg-white p-5 sm:p-8 md:p-10 rounded-3xl border border-brand-200/50 shadow-xl shadow-brand-100 min-h-[360px] sm:min-h-[380px] transition-all duration-500 relative overflow-hidden"
          aria-live="polite"
        >
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="text-xs font-bold text-brand-700 bg-brand-100 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                {content["clinical.align_label"]}
              </span>
              <span className="text-xs text-brand-800 font-medium">
                {content["clinical.degree_label"]}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-brand-900">
                {duty.title}
              </h3>
              <p className="text-xs font-semibold text-brand-600">
                {duty.highlight}
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-brand-100">
              {duty.bullets.map((bullet) => (
                <div key={bullet} className="flex items-start space-x-3">
                  <span
                    className="text-brand-500 font-bold mt-1"
                    aria-hidden="true"
                  >
                    ✔
                  </span>
                  <p className="text-xs text-brand-900 leading-relaxed">
                    {bullet}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-brand-50 p-4 rounded-2xl border border-brand-100 mt-6">
              <p className="text-xs italic text-brand-800">
                &quot; {duty.quote} &quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
