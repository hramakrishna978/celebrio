export default function ServicesPage() {
  return (
    <div>
      <p className="text-sm font-medium text-violet-600">
        CELEBRIO ADMIN
      </p>

      <h1 className="mt-2 text-3xl font-bold text-slate-950">
        Services
      </h1>

      <p className="mt-2 text-slate-500">
        Manage the wedding services offered by Celebrio.
      </p>

      <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">
          Service Catalogue
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Photography, decoration, catering, venues, entertainment
          and other services will be managed here.
        </p>
      </div>
    </div>
  );
}