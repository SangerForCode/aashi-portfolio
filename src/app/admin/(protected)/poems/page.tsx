import PoemAdminEditor from "@/components/admin/PoemAdminEditor";

export default function AdminPoemsPage() {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Editor</p>
      <h1 className="mt-2 mb-6 font-serif text-3xl font-bold">Poems</h1>
      <PoemAdminEditor
        description="Drafts stay private. Publishing makes a poem available on the public poetry pages."
      />
    </div>
  );
}
