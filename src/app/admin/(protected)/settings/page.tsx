import AdminCrudEditor from "@/components/admin/AdminCrudEditor";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-10">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Editor</p>
        <h1 className="mt-2 mb-6 font-serif text-3xl font-bold">Settings &amp; contact</h1>
        <AdminCrudEditor
          resource="site_settings"
          description="Only explicitly public settings are exposed to the public site."
        />
      </div>
      <AdminCrudEditor
        resource="contact_links"
        description="Published contact links appear in the contact section."
      />
    </div>
  );
}
