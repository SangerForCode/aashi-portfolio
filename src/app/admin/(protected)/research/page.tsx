import AdminCrudEditor from "@/components/admin/AdminCrudEditor";

export default function AdminResearchPage() {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Editor</p>
      <h1 className="mt-2 mb-6 font-serif text-3xl font-bold">Research projects</h1>
      <AdminCrudEditor
        resource="research_projects"
        description="Manage the published research card, abstract, PDF path, and highlights."
      />
    </div>
  );
}
