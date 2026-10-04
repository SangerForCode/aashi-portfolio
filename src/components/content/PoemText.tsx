import {
  splitPoemStanzas,
} from "@/lib/content/poem-formatting";
import PoemInlineText from "@/components/content/PoemInlineText";

export default function PoemText({
  content,
  className = "",
}: {
  content: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {splitPoemStanzas(content).map((stanza, index) => (
        <p
          key={`${index}-${stanza.slice(0, 24)}`}
          className="whitespace-pre-wrap"
        >
          {stanza.split("\n").map((line, lineIndex) => (
            <span key={`${lineIndex}-${line}`}>
              {lineIndex > 0 && <br />}
              <PoemInlineText text={line} />
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}
