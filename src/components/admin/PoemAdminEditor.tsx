"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { createUniquePoemSlug } from "@/lib/content/poem-formatting";
import PoemText from "@/components/content/PoemText";

interface PoemRow extends Record<string, unknown> {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: "draft" | "published";
  published_at: string | null;
  sort_order: number;
}

type PoemDraft = {
  title: string;
  excerpt: string;
  content: string;
  status: "draft" | "published";
};

const emptyDraft: PoemDraft = {
  title: "",
  excerpt: "",
  content: "",
  status: "draft",
};

const inputClass =
  "mt-1 min-h-11 w-full rounded-xl border border-brand-200 bg-white px-3 py-2.5 text-base text-brand-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 sm:text-sm";

export default function PoemAdminEditor({ description }: { description: string }) {
  const [rows, setRows] = useState<PoemRow[]>([]);
  const [draft, setDraft] = useState<PoemDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const poemTextRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<HTMLElement>(null);

  const loadRows = useCallback(async () => {
    const { data, error } = await createClient()
      .from("poems")
      .select("*")
      .order("sort_order", { ascending: true })
      .returns<PoemRow[]>();

    if (error) {
      setNotice(error.message);
    } else {
      setRows(data ?? []);
      setNotice("");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadRows(), 0);
    return () => window.clearTimeout(timer);
  }, [loadRows]);

  function startNew() {
    setEditingId(null);
    setDraft(emptyDraft);
    setNotice("");
    setIsLibraryOpen(false);
    scrollToEditor();
  }

  function startEditing(poem: PoemRow) {
    setEditingId(poem.id);
    setDraft({
      title: poem.title,
      excerpt: poem.excerpt ?? "",
      content: poem.content,
      status: poem.status,
    });
    setNotice("");
    setIsLibraryOpen(false);
    scrollToEditor();
  }

  function scrollToEditor() {
    if (!window.matchMedia("(max-width: 1279px)").matches) return;
    window.requestAnimationFrame(() =>
      editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  }

  function togglePoemLibrary() {
    const shouldOpen = !isLibraryOpen;
    setIsLibraryOpen(shouldOpen);
    if (shouldOpen) {
      window.requestAnimationFrame(() =>
        document
          .getElementById("poem-library")
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    } else {
      scrollToEditor();
    }
  }

  function updateDraft<Key extends keyof PoemDraft>(key: Key, value: PoemDraft[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function formatSelection(style: "bold" | "italic" | "underline") {
    const textarea = poemTextRef.current;
    if (!textarea) return;

    const marker = style === "bold" ? "**" : style === "italic" ? "*" : "++";
    const content = draft.content;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.slice(start, end);
    const textToFormat =
      selectedText ||
      (style === "bold" ? "bold text" : style === "italic" ? "italic text" : "underlined text");
    const nextContent =
      content.slice(0, start) + marker + textToFormat + marker + content.slice(end);

    updateDraft("content", nextContent);
    window.requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + marker.length, start + marker.length + textToFormat.length);
    });
  }

  function handlePoemTextKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!(event.metaKey || event.ctrlKey)) return;
    const key = event.key.toLowerCase();
    const style = key === "b" ? "bold" : key === "i" ? "italic" : key === "u" ? "underline" : null;
    if (!style) return;
    event.preventDefault();
    formatSelection(style);
  }

  async function savePoem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setNotice("");

    const title = draft.title.trim();
    const content = draft.content.replace(/\r\n?/g, "\n").trim();
    if (!title || !content) {
      setNotice("Please add a title and poem text before saving.");
      setIsSaving(false);
      return;
    }

    const { data: slugRows, error: slugError } = await createClient()
      .from("poems")
      .select("id, slug")
      .returns<{ id: string; slug: string }[]>();

    if (slugError) {
      setNotice(slugError.message);
      setIsSaving(false);
      return;
    }

    const otherSlugs = (slugRows ?? [])
      .filter((poem) => poem.id !== editingId)
      .map((poem) => poem.slug);
    const slug = createUniquePoemSlug(title, otherSlugs);
    const currentPoem = rows.find((poem) => poem.id === editingId);
    const now = new Date().toISOString();
    const payload = {
      title,
      slug,
      excerpt: draft.excerpt.trim() || null,
      content,
      status: draft.status,
      published_at:
        draft.status === "published" ? currentPoem?.published_at ?? now : null,
      updated_at: now,
    };

    const supabase = createClient();
    const result = editingId
      ? await supabase.from("poems").update(payload).eq("id", editingId)
      : await supabase.from("poems").insert(payload);

    if (result.error) {
      setNotice(result.error.message);
      setIsSaving(false);
      return;
    }

    setNotice(draft.status === "published" ? "Poem published." : "Draft saved.");
    setDraft(emptyDraft);
    setEditingId(null);
    await loadRows();
    setIsSaving(false);
  }

  async function deletePoem(poem: PoemRow) {
    if (!window.confirm(`Delete “${poem.title}”?`)) return;

    const { error } = await createClient().from("poems").delete().eq("id", poem.id);
    if (error) {
      setNotice(error.message);
      return;
    }

    if (editingId === poem.id) startNew();
    setNotice("Poem deleted.");
    await loadRows();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
      <section
        id="poem-library"
        className={`${isLibraryOpen ? "order-first block" : "order-2 hidden"} rounded-2xl border border-brand-100 bg-white p-4 shadow-sm xl:order-first xl:block sm:rounded-3xl sm:p-7`}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-brand-900">Your poems</h2>
            <p className="mt-1 text-sm text-brand-700">{description}</p>
          </div>
          <button
            type="button"
            onClick={startNew}
            className="min-h-11 shrink-0 rounded-xl border border-brand-200 px-3 text-sm font-semibold text-brand-800 hover:bg-brand-50 sm:px-4"
          >
            New poem
          </button>
        </div>

        {isLoading ? (
          <p className="text-sm text-brand-700">Loading poems…</p>
        ) : rows.length === 0 ? (
          <p className="rounded-2xl bg-brand-50 p-4 text-sm text-brand-700">
            No poems yet. Start with a title and let the words come.
          </p>
        ) : (
          <ul className="divide-y divide-brand-100">
            {rows.map((poem) => (
              <li key={poem.id} className="flex items-center justify-between gap-2 py-2 sm:gap-4 sm:py-3">
                <button
                  type="button"
                  onClick={() => startEditing(poem)}
                  className="min-h-11 min-w-0 flex-1 truncate py-2 text-left text-sm font-semibold text-brand-900 hover:text-brand-600"
                >
                  {poem.title}
                </button>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-xs capitalize text-brand-600">{poem.status}</span>
                  <button
                    type="button"
                    onClick={() => void deletePoem(poem)}
                    className="min-h-11 shrink-0 px-2 text-xs font-semibold text-brand-600 hover:text-brand-900"
                    aria-label={`Delete ${poem.title}`}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section
        ref={editorRef}
        className="order-first min-w-0 scroll-mt-4 rounded-2xl border border-brand-100 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-7 xl:order-last"
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600">
              {editingId ? "Your poem" : "A new poem"}
            </p>
            <h2 className="mt-1 font-serif text-2xl font-bold text-brand-900">
              {editingId ? "Make it yours" : "Start writing"}
            </h2>
          </div>
          <button
            type="button"
            aria-expanded={isLibraryOpen}
            aria-controls="poem-library"
            onClick={togglePoemLibrary}
            className="min-h-11 shrink-0 rounded-xl border border-brand-200 px-3 text-sm font-semibold text-brand-800 hover:bg-brand-50 xl:hidden"
          >
            {isLibraryOpen ? "Close list" : `My poems${rows.length ? ` (${rows.length})` : ""}`}
          </button>
        </div>

        <form className="space-y-4" onSubmit={savePoem}>
          <label className="block text-sm font-semibold text-brand-800">
            Title
            <input
              required
              value={draft.title}
              onChange={(event) => updateDraft("title", event.target.value)}
              placeholder="Give your poem a title"
              className={inputClass}
            />
          </label>

          <label className="block text-sm font-semibold text-brand-800">
            Short introduction <span className="font-normal text-brand-500">(optional)</span>
            <textarea
              rows={2}
              value={draft.excerpt}
              onChange={(event) => updateDraft("excerpt", event.target.value)}
              placeholder="A few words to introduce your poem"
              className={`${inputClass} resize-y`}
            />
          </label>

          <div>
            <label htmlFor="poem-text" className="block text-sm font-semibold text-brand-800">
              Poem text
            </label>
            <p id="poem-writing-help" className="mt-1 text-xs leading-relaxed text-brand-600">
              Write naturally. Press Enter for a new line and leave a blank line between stanzas.
              Select words to make them bold, italic, or underlined.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2" aria-label="Text formatting">
              <button
                type="button"
                onClick={() => formatSelection("bold")}
                title="Bold selected text (Ctrl/⌘+B)"
                aria-label="Make selected text bold"
                className="min-h-11 min-w-11 rounded-lg border border-brand-200 px-3 font-bold text-brand-800 hover:bg-brand-50"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => formatSelection("italic")}
                title="Italicize selected text (Ctrl/⌘+I)"
                aria-label="Make selected text italic"
                className="min-h-11 min-w-11 rounded-lg border border-brand-200 px-3 font-serif italic text-brand-800 hover:bg-brand-50"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => formatSelection("underline")}
                title="Underline selected text (Ctrl/⌘+U)"
                aria-label="Underline selected text"
                className="min-h-11 min-w-11 rounded-lg border border-brand-200 px-3 text-brand-800 hover:bg-brand-50"
              >
                <span className="underline underline-offset-2">U</span>
              </button>
              <span className="text-xs text-brand-500">Select words, then choose a style</span>
            </div>
            <textarea
              id="poem-text"
              ref={poemTextRef}
              required
              rows={13}
              value={draft.content}
              onChange={(event) => updateDraft("content", event.target.value)}
              onKeyDown={handlePoemTextKeyDown}
              aria-describedby="poem-writing-help"
              placeholder={"Write your poem here…\n\nStart another stanza here."}
              className={`${inputClass} min-h-72 resize-y font-serif leading-7`}
            />
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-brand-800">When you’re ready</legend>
            <div className="grid grid-cols-2 gap-3">
              {(["draft", "published"] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  aria-pressed={draft.status === status}
                  onClick={() => updateDraft("status", status)}
                  className={`min-h-11 rounded-xl border px-2 py-2.5 text-sm font-semibold capitalize transition-colors sm:px-4 ${
                    draft.status === status
                      ? "border-brand-600 bg-brand-50 text-brand-900"
                      : "border-brand-200 text-brand-700 hover:bg-brand-50"
                  }`}
                >
                  {status === "draft" ? "Keep as draft" : "Publish poem"}
                </button>
              ))}
            </div>
          </fieldset>

          {notice && (
            <p role="status" className="text-sm text-brand-700">
              {notice}
            </p>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="min-h-12 w-full rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
          >
            {isSaving
              ? "Saving…"
              : draft.status === "published"
                ? "Save and publish"
                : "Save draft"}
          </button>
        </form>

        <div className="mt-6 rounded-2xl border border-brand-100 bg-brand-50/60 p-4 sm:mt-8 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-500">Live preview</p>
          <h3 className="mt-3 font-serif text-xl font-bold text-brand-900">
            {draft.title || "Your poem’s title"}
          </h3>
          {draft.excerpt && (
            <p className="mt-2 whitespace-pre-wrap text-sm text-brand-700">{draft.excerpt}</p>
          )}
          <PoemText
            content={draft.content}
            className="mt-5 space-y-5 font-serif text-base leading-7 text-brand-800"
          />
          {!draft.content && (
            <p className="mt-5 text-sm italic text-brand-500">Your poem will appear here as you write.</p>
          )}
        </div>
      </section>
    </div>
  );
}
