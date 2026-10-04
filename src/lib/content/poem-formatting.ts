export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function splitPoemStanzas(content: string): string[] {
  const normalized = content
    .replace(/\r\n?/g, "\n")
    .replace(/^(?:[\t ]*\n)+|(?:\n[\t ]*)+$/g, "");

  if (!normalized) return [];

  return normalized
    .split(/\n[\t ]*\n+/)
    .filter((stanza) => stanza.length > 0);
}

export type PoemTextSegment = {
  text: string;
  style: "bold" | "italic" | "underline" | null;
};

export function splitPoemInlineFormatting(value: string): PoemTextSegment[] {
  const segments: PoemTextSegment[] = [];
  const formatting = /(\*\*[\s\S]+?\*\*|\+\+[\s\S]+?\+\+|\*[^*]+?\*)/g;
  let lastIndex = 0;

  for (const match of value.matchAll(formatting)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      segments.push({ text: value.slice(lastIndex, index), style: null });
    }

    const isBold = match[0].startsWith("**");
    const isUnderline = match[0].startsWith("++");
    const markerLength = isBold || isUnderline ? 2 : 1;
    segments.push({
      text: match[0].slice(markerLength, -markerLength),
      style: isBold ? "bold" : isUnderline ? "underline" : "italic",
    });
    lastIndex = index + match[0].length;
  }

  if (lastIndex < value.length) {
    segments.push({ text: value.slice(lastIndex), style: null });
  }

  return segments;
}

export function createUniquePoemSlug(
  title: string,
  existingSlugs: string[],
): string {
  const base = slugify(title) || "poem";
  const taken = new Set(existingSlugs);
  if (!taken.has(base)) return base;

  let suffix = 2;
  while (taken.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}

export function formatPoemDate(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}
