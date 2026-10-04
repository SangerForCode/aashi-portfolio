import AdminCrudEditor from "@/components/admin/AdminCrudEditor";

export default function AdminClinicalPage() {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Editor</p>
      <h1 className="mt-2 mb-6 font-serif text-3xl font-bold">Clinical matcher</h1>
      <AdminCrudEditor
        resource="clinical_duties"
        description="Each published duty appears in the interactive alignment matrix."
      />
    </div>
  );
}
