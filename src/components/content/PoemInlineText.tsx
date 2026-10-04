import { splitPoemInlineFormatting } from "@/lib/content/poem-formatting";

export default function PoemInlineText({ text }: { text: string }) {
  return (
    <>
      {splitPoemInlineFormatting(text).map((segment, index) => {
        const key = `${index}-${segment.text}`;
        if (segment.style === "bold") return <strong key={key}>{segment.text}</strong>;
        if (segment.style === "italic") return <em key={key}>{segment.text}</em>;
        return <span key={key}>{segment.text}</span>;
      })}
    </>
  );
}
