const benefits = [
  ["One place", "Planning, vendors, budgets, documents, payments and progress stay connected."],
  ["Clear visibility", "Clients and wedding teams can see what is completed, pending and next."],
  ["Personalized", "The wedding plan is built around the couple, their events, priorities and budget."],
  ["Built to grow", "The platform is designed so we can add vendor, mobile, automation and AI capabilities later."],
];

export default function WhyCelebrio() {
  return (
    <section id="why-celebrio" className="bg-white py-24">
      <div className="celebrio-container grid gap-14 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-700">
            Why Celebrio
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Less coordination. More celebration.
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Wedding planning creates hundreds of small decisions. Celebrio
            connects those decisions into one organized journey so the couple
            can focus on the moments that matter.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {benefits.map(([title, description]) => (
            <div key={title} className="rounded-3xl border border-slate-200 p-6">
              <div className="mb-4 h-2 w-10 rounded-full bg-violet-600" />
              <h3 className="font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
