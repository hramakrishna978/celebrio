const services = [
  ["Wedding Planning", "Personalized plans, timelines, milestones and task management."],
  ["Vendor Management", "Vendor information, coordination, quotes, bookings and follow-ups."],
  ["Budget & Payments", "Budgets, expenses, invoices, payment tracking and receipts."],
  ["Documents & Agreements", "Proposals, agreements, approvals and wedding documents."],
  ["Meetings & Communication", "Consultations, meetings, messages, updates and action items."],
  ["Reports & Progress", "Live dashboards, milestone reports and project progress."],
];

export default function Services() {
  return (
    <section id="services" className="bg-[#faf7ff] py-24">
      <div className="celebrio-container">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-700">
            One platform
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Everything your wedding team needs.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Celebrio is designed to become the single point of contact for your
            wedding planning journey.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(([title, description], index) => (
            <article key={title} className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-100">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 font-bold text-violet-700">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900">{title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
