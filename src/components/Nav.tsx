import FlowerIcon from "@/components/FlowerIcon";
import Link from "next/link";

export default function Nav({
  brandName,
  homePrefix = "",
}: {
  brandName: string;
  homePrefix?: string;
}) {
  return (
    <div className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] sm:w-[90%] max-w-5xl z-50">
      <nav className="glass-nav rounded-full px-3.5 sm:px-6 py-2.5 sm:py-3.5 flex justify-between items-center gap-3 shadow-lg shadow-brand-100/40 border border-white/60">
        <a href={`${homePrefix}#top`} className="flex items-center space-x-2">
          <span className="w-8 h-8 flex items-center justify-center text-brand-900">
            <FlowerIcon />
          </span>
          <span className="font-serif text-sm sm:text-base font-bold tracking-wide text-brand-900">
            {brandName}
          </span>
        </a>

        <div className="hidden lg:flex space-x-6 items-center text-xs font-semibold tracking-wide text-brand-800">
          <a href={`${homePrefix}#about`} className="hover:text-brand-500 transition-colors">
            About
          </a>
          <a href={`${homePrefix}#research`} className="hover:text-brand-500 transition-colors">
            My Research
          </a>
          <a href={`${homePrefix}#matcher`} className="hover:text-brand-500 transition-colors">
            Internship Matrix
          </a>
          <a href={`${homePrefix}#contact`} className="hover:text-brand-500 transition-colors">
            Contact
          </a>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/poetry"
            className="rounded-full border border-brand-300 bg-white/80 px-3 py-2 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-100 sm:px-4"
          >
            Poetry
          </Link>
          <a
            href={`${homePrefix}#contact`}
            className="rounded-full bg-brand-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm shadow-brand-200 transition-all duration-300 hover:bg-brand-700 sm:px-4"
          >
            Contact
          </a>
        </div>
      </nav>
    </div>
  );
}
