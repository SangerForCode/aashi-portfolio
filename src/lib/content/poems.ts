import { createClient } from "@/lib/supabase/server";

export interface Poem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: "draft" | "published";
  published_at: string | null;
  tags: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
}

function normalizePoem(row: Omit<Poem, "tags"> & { tags: unknown }): Poem {
  return {
    ...row,
    tags:
      Array.isArray(row.tags) && row.tags.every((tag) => typeof tag === "string")
        ? row.tags
        : [],
  };
}

export async function getPublishedPoems(): Promise<Poem[]> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return [];
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("poems")
      .select("id, title, slug, excerpt, content, status, published_at, tags, sort_order, created_at, updated_at")
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .order("published_at", { ascending: false })
      .returns<Poem[]>();

    if (error || !data) return [];
    return data.map(normalizePoem);
  } catch {
    return [];
  }
}

export async function getPublishedPoem(slug: string): Promise<Poem | null> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("poems")
      .select("id, title, slug, excerpt, content, status, published_at, tags, sort_order, created_at, updated_at")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error || !data) return null;
    return normalizePoem(data);
  } catch {
    return null;
  }
}
