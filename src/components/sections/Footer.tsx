import FlowerIcon from "@/components/FlowerIcon";
import type { HomeContent } from "@/lib/content/home";

export default function Footer({
  brandName,
  content,
}: {
  brandName: string;
  content: HomeContent;
}) {
  return (
    <footer className="bg-brand-900 text-brand-100 py-12 px-6 border-t border-brand-800/80">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center space-x-2.5">
          <span className="w-8 h-8 flex items-center justify-center text-brand-100">
            <FlowerIcon />
          </span>
          <span className="font-serif text-lg font-bold tracking-wide">
            {brandName}
          </span>
        </div>

        <p className="text-[10px] text-brand-200/50 max-w-sm text-center md:text-right leading-relaxed">
          {content["footer.caption"]}
        </p>
      </div>
    </footer>
  );
}
