import { splitPoemInlineFormatting } from "@/lib/content/poem-formatting";

export default function PoemInlineText({ text }: { text: string }) {
  return (
    <>
      {splitPoemInlineFormatting(text).map((segment, index) => {
        const key = `${index}-${segment.text}`;
        if (segment.style === "bold") {
          return <strong key={key} className="font-bold">{segment.text}</strong>;
        }
        if (segment.style === "italic") {
          return <em key={key} className="italic">{segment.text}</em>;
        }
        if (segment.style === "underline") {
          return (
            <u key={key} className="underline underline-offset-2">
              {segment.text}
            </u>
          );
        }
        return <span key={key}>{segment.text}</span>;
      })}
    </>
  );
}
