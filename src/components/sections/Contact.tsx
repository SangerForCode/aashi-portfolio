import type { ContactLink, HomeContent } from "@/lib/content/home";

export default function Contact({
  content,
  links,
}: {
  content: HomeContent;
  links: ContactLink[];
}) {
  const email = links.find(({ type }) => type === "email");
  const linkedIn = links.find(({ label }) => label.toLowerCase() === "linkedin");

  return (
    <section
      id="contact"
      className="py-16 sm:py-24 px-4 sm:px-6 max-w-4xl mx-auto z-10 relative"
    >
      <div className="bg-white rounded-3xl border border-brand-100 p-5 sm:p-8 md:p-12 shadow-xl shadow-brand-100/60 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
            {content["contact.eyebrow"]}
          </span>
          <h2 className="font-serif text-3xl font-bold text-brand-900">
            {content["contact.heading"]}
          </h2>
          <div className="w-12 h-0.5 bg-brand-300 mx-auto rounded-full" />
          <p className="text-sm text-brand-800 max-w-xl mx-auto">
            {content["contact.description"]}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <a
            href={email ? `mailto:${email.value}` : "mailto:"}
            className="w-full sm:w-64 p-5 rounded-2xl border border-brand-200 bg-brand-50/40 hover:bg-brand-100/60 transition-all text-center flex items-center justify-center gap-2.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-brand-700"
              aria-hidden="true"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-10 5L2 7" />
            </svg>
            <span className="text-sm font-semibold text-brand-900">
              {email?.label ?? content["contact.email_label"]}
            </span>
          </a>
          <a
            href={linkedIn?.value ?? "https://www.linkedin.com/in/aashi-sharma13"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-64 p-5 rounded-2xl border border-brand-200 bg-white hover:bg-brand-50/60 transition-all text-center flex items-center justify-center gap-2.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-brand-700"
              aria-hidden="true"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect width="4" height="12" x="2" y="9" />
              <circle cx="4" cy="4" r="2" />
            </svg>
            <span className="text-sm font-semibold text-brand-900">
              {linkedIn?.label ?? content["contact.linkedin_label"]}
            </span>
          </a>
        </div>

        <div className="text-center pt-2">
          <a
            href={`${email ? `mailto:${email.value}` : "mailto:"}?subject=Collaboration%20Inquiry`}
            className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition-all shadow-md shadow-brand-200"
          >
            {content["contact.cta"]}
          </a>
        </div>
      </div>
    </section>
  );
}
