import { describe, expect, it } from "vitest";
import {
  createUniquePoemSlug,
  formatPoemDate,
  slugify,
  splitPoemInlineFormatting,
  splitPoemStanzas,
} from "./poem-formatting";

describe("slugify", () => {
  it("normalizes titles into URL-safe slugs", () => {
    expect(slugify("  Letters from the Moon  ")).toBe("letters-from-the-moon");
    expect(slugify("Café & Connection")).toBe("cafe-connection");
  });
});

describe("createUniquePoemSlug", () => {
  it("creates a title slug and adds a suffix when the title is already used", () => {
    expect(createUniquePoemSlug("Letters from the Moon", [])).toBe(
      "letters-from-the-moon",
    );
    expect(
      createUniquePoemSlug("Letters from the Moon", [
        "letters-from-the-moon",
        "letters-from-the-moon-2",
      ]),
    ).toBe("letters-from-the-moon-3");
  });

  it("uses a safe fallback when a title has no URL characters", () => {
    expect(createUniquePoemSlug("✨", [])).toBe("poem");
  });
});

describe("splitPoemStanzas", () => {
  it("preserves line breaks and separates stanzas on blank lines", () => {
    expect(splitPoemStanzas("First line\nSecond line\n\nThird line\nFourth line")).toEqual([
      "First line\nSecond line",
      "Third line\nFourth line",
    ]);
  });

  it("normalizes Windows line endings and ignores empty leading/trailing stanzas", () => {
    expect(splitPoemStanzas("\r\nFirst\r\n\r\nSecond\r\n\r\n")).toEqual([
      "First",
      "Second",
    ]);
  });
});

describe("splitPoemInlineFormatting", () => {
  it("recognizes bold, italic, and underlined text in public poems", () => {
    expect(
      splitPoemInlineFormatting("A **bright** and *quiet* and ++clear++ morning"),
    ).toEqual([
      { text: "A ", style: null },
      { text: "bright", style: "bold" },
      { text: " and ", style: null },
      { text: "quiet", style: "italic" },
      { text: " and ", style: null },
      { text: "clear", style: "underline" },
      { text: " morning", style: null },
    ]);
  });

  it("recognizes formatting across line breaks without showing the markers", () => {
    expect(splitPoemInlineFormatting("**first line\nsecond line**")).toEqual([
      { text: "first line\nsecond line", style: "bold" },
    ]);
  });

  it("leaves unmatched formatting markers as regular text", () => {
    expect(splitPoemInlineFormatting("An unfinished *thought")).toEqual([
      { text: "An unfinished *thought", style: null },
    ]);
  });
});

describe("formatPoemDate", () => {
  it("formats published dates consistently", () => {
    expect(formatPoemDate("2026-10-04T23:30:00.000Z")).toBe("October 4, 2026");
  });

  it("returns an empty string for missing or invalid dates", () => {
    expect(formatPoemDate(null)).toBe("");
    expect(formatPoemDate("not-a-date")).toBe("");
  });
});
