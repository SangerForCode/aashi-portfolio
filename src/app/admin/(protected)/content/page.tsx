import AdminCrudEditor from "@/components/admin/AdminCrudEditor";

export default function AdminContentPage() {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Editor</p>
      <h1 className="mt-2 mb-6 font-serif text-3xl font-bold">Page copy</h1>
      <AdminCrudEditor
        resource="site_content"
        description="Only rows marked public are sent to the public site. New rows default to private."
      />
    </div>
  );
}
