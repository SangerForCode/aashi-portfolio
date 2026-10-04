"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Resource =
  | "site_content"
  | "research_projects"
  | "clinical_duties"
  | "site_settings"
  | "contact_links";

type FieldKind = "text" | "textarea" | "number" | "checkbox" | "json" | "select";

interface Field {
  key: string;
  label: string;
  kind?: FieldKind;
  required?: boolean;
  defaultValue?: string | number | boolean;
  options?: { label: string; value: string }[];
}

interface EditorRow extends Record<string, unknown> {
  id: string;
}

const resourceConfig: Record<
  Resource,
  { title: string; summaryField: string; fields: Field[] }
> = {
  site_content: {
    title: "Page copy",
    summaryField: "key",
    fields: [
      { key: "key", label: "Content key", required: true },
      { key: "value", label: "Copy", kind: "textarea", required: true },
      { key: "group", label: "Group", required: true },
      { key: "is_public", label: "Public", kind: "checkbox", defaultValue: false },
    ],
  },
  research_projects: {
    title: "Research project",
    summaryField: "title",
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "slug", label: "Slug", required: true },
      { key: "description", label: "Description", kind: "textarea" },
      { key: "supervisor", label: "Supervisor" },
      { key: "project_focus", label: "Project focus" },
      { key: "enrolment_id", label: "Enrolment ID" },
      { key: "abstract", label: "Abstract", kind: "textarea" },
      {
        key: "highlights",
        label: "Highlights (JSON array of { title, text })",
        kind: "json",
        defaultValue: "[]",
      },
      { key: "pdf_path", label: "PDF path" },
      { key: "sort_order", label: "Sort order", kind: "number", defaultValue: 0 },
      { key: "published", label: "Published", kind: "checkbox", defaultValue: true },
    ],
  },
  clinical_duties: {
    title: "Clinical duty",
    summaryField: "label",
    fields: [
      { key: "key", label: "Key", required: true },
      { key: "label", label: "List label", required: true },
      { key: "title", label: "Detail title", required: true },
      { key: "highlight", label: "Highlight" },
      {
        key: "bullets",
        label: "Bullets (JSON array of strings)",
        kind: "json",
        defaultValue: "[]",
      },
      { key: "quote", label: "Quote", kind: "textarea" },
      { key: "sort_order", label: "Sort order", kind: "number", defaultValue: 0 },
      { key: "published", label: "Published", kind: "checkbox", defaultValue: true },
    ],
  },
  site_settings: {
    title: "Site setting",
    summaryField: "key",
    fields: [
      { key: "key", label: "Setting key", required: true },
      { key: "value", label: "Value", kind: "textarea", required: true },
      { key: "is_public", label: "Public", kind: "checkbox", defaultValue: false },
    ],
  },
  contact_links: {
    title: "Contact link",
    summaryField: "label",
    fields: [
      { key: "label", label: "Label", required: true },
      {
        key: "type",
        label: "Type",
        kind: "select",
        defaultValue: "url",
        options: [
          { label: "Email", value: "email" },
          { label: "URL", value: "url" },
        ],
      },
      { key: "value", label: "Value", required: true },
      { key: "sort_order", label: "Sort order", kind: "number", defaultValue: 0 },
      { key: "published", label: "Published", kind: "checkbox", defaultValue: true },
    ],
  },
};

function getInitialDraft(fields: Field[]) {
  return Object.fromEntries(
    fields.map(({ key, defaultValue, kind }) => [
      key,
      kind === "checkbox" ? Boolean(defaultValue) : (defaultValue ?? ""),
    ]),
  );
}

function rowToDraft(row: EditorRow, fields: Field[]) {
  return Object.fromEntries(
    fields.map(({ key, kind }) => {
      const value = row[key];
      if (kind === "json") return [key, JSON.stringify(value ?? [], null, 2)];
      if (kind === "checkbox") return [key, Boolean(value)];
      return [key, value ?? ""];
    }),
  );
}

export default function AdminCrudEditor({
  resource,
  description,
}: {
  resource: Resource;
  description: string;
}) {
  const config = resourceConfig[resource];
  const [rows, setRows] = useState<EditorRow[]>([]);
  const [draft, setDraft] = useState<Record<string, unknown>>(() =>
    getInitialDraft(config.fields),
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadRows = useCallback(async () => {
    const supabase = createClient();
    const query = supabase
      .from(resource)
      .select("*")
      .returns<EditorRow[]>();
    const orderedQuery =
      resource === "site_content" || resource === "site_settings"
        ? query.order("key", { ascending: true })
        : query.order("sort_order", { ascending: true });
    const { data, error } = await orderedQuery;

    if (error) {
      setNotice(error.message);
    } else {
      setRows(data ?? []);
      setNotice("");
    }
    setIsLoading(false);
  }, [resource]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadRows(), 0);
    return () => window.clearTimeout(timer);
  }, [loadRows]);

  function startNew() {
    setEditingId(null);
    setDraft(getInitialDraft(config.fields));
    setNotice("");
  }

  function startEditing(row: EditorRow) {
    setEditingId(row.id);
    setDraft(rowToDraft(row, config.fields));
    setNotice("");
  }

  function updateDraft(key: string, value: unknown) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function saveRecord(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setNotice("");

    let payload: Record<string, unknown>;
    try {
      payload = Object.fromEntries(
        config.fields.map(({ key, kind }) => {
          let value = draft[key];
          if (kind === "json") value = JSON.parse(String(value || "[]"));
          if (kind === "number") value = Number(value || 0);
          return [key, value];
        }),
      );
    } catch {
      setNotice("One of the JSON fields is not valid JSON.");
      setIsSaving(false);
      return;
    }

    const now = new Date().toISOString();
    if (["site_content", "site_settings", "research_projects"].includes(resource)) {
      payload.updated_at = now;
    }

    const supabase = createClient();
    const result = editingId
      ? await supabase
          .from(resource)
          .update(payload as never)
          .eq("id", editingId)
      : await supabase.from(resource).insert(payload as never);

    if (result.error) {
      setNotice(result.error.message);
      setIsSaving(false);
      return;
    }

    setNotice("Saved.");
    setDraft(getInitialDraft(config.fields));
    setEditingId(null);
    await loadRows();
    setIsSaving(false);
  }

  async function deleteRecord(row: EditorRow) {
    const summary = String(row[config.summaryField] ?? config.title);
    if (!window.confirm(`Delete “${summary}”?`)) return;

    const { error } = await createClient()
      .from(resource)
      .delete()
      .eq("id", row.id);

    if (error) {
      setNotice(error.message);
      return;
    }

    if (editingId === row.id) startNew();
    setNotice("Deleted.");
    await loadRows();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,0.8fr)]">
      <section className="rounded-3xl border border-brand-100 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-brand-900">
              {config.title}s
            </h2>
            <p className="mt-1 text-sm text-brand-700">{description}</p>
          </div>
          <button
            type="button"
            onClick={startNew}
            className="shrink-0 rounded-xl border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-800 hover:bg-brand-50"
          >
            New
          </button>
        </div>

        {isLoading ? (
          <p className="text-sm text-brand-700">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-brand-700">No records yet.</p>
        ) : (
          <ul className="divide-y divide-brand-100">
            {rows.map((row) => (
              <li
                key={row.id}
                className="flex items-center justify-between gap-4 py-3"
              >
                <button
                  type="button"
                  onClick={() => startEditing(row)}
                  className="min-w-0 flex-1 truncate text-left text-sm font-semibold text-brand-900 hover:text-brand-600"
                >
                  {String(row[config.summaryField] ?? config.title)}
                </button>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-xs text-brand-600">
                    {row.published === false || row.is_public === false
                      ? "Hidden"
                      : "Visible"}
                  </span>
                  <button
                    type="button"
                    onClick={() => void deleteRecord(row)}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-900"
                    aria-label={`Delete ${String(row[config.summaryField] ?? config.title)}`}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-3xl border border-brand-100 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="mb-5 font-serif text-xl font-bold text-brand-900">
          {editingId ? "Edit" : "Create"} {config.title.toLowerCase()}
        </h2>
        <form className="space-y-4" onSubmit={saveRecord}>
          {config.fields.map((field) => {
            const value = draft[field.key];
            const inputClass =
              "mt-1 w-full rounded-xl border border-brand-200 bg-white px-3 py-2.5 text-sm text-brand-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

            if (field.kind === "checkbox") {
              return (
                <label
                  key={field.key}
                  className="flex items-center gap-3 text-sm font-medium text-brand-800"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={(event) => updateDraft(field.key, event.target.checked)}
                    className="h-4 w-4 accent-brand-600"
                  />
                  {field.label}
                </label>
              );
            }

            return (
              <label
                key={field.key}
                className="block text-sm font-medium text-brand-800"
              >
                {field.label}
                {field.kind === "textarea" || field.kind === "json" ? (
                  <textarea
                    rows={field.kind === "json" ? 6 : 3}
                    required={field.required}
                    value={String(value ?? "")}
                    onChange={(event) => updateDraft(field.key, event.target.value)}
                    className={`${inputClass} resize-y`}
                  />
                ) : field.kind === "select" ? (
                  <select
                    value={String(value ?? "")}
                    onChange={(event) => updateDraft(field.key, event.target.value)}
                    className={inputClass}
                  >
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.kind === "number" ? "number" : "text"}
                    required={field.required}
                    value={String(value ?? "")}
                    onChange={(event) => updateDraft(field.key, event.target.value)}
                    className={inputClass}
                  />
                )}
              </label>
            );
          })}

          {notice && (
            <p role="status" className="text-sm text-brand-700">
              {notice}
            </p>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
          >
            {isSaving ? "Saving…" : editingId ? "Save changes" : "Create record"}
          </button>
        </form>
      </section>
    </div>
  );
}
