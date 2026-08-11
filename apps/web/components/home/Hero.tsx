export default function Hero() {
  return (
    <section id="home" className="celebrio-grid overflow-hidden bg-[#fcfaff]">
      <div className="celebrio-container grid min-h-[680px] items-center gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-2 text-sm font-semibold text-violet-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-violet-600" />
            Wedding planning, all in one place
          </div>

          <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            <span className="celebrio-gradient-text">Celebrate Every Moment</span>
          </h1>

          <h2 className="mt-7 max-w-2xl text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
            Your wedding. Your plan. One simple platform.
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            From your first consultation to the wedding day, Celebrio brings
            planning, vendors, tasks, budgets, documents, payments and progress
            into one connected experience.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#consultation"
              className="rounded-xl bg-violet-700 px-7 py-4 text-center font-semibold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-800"
            >
              Start Free Consultation
            </a>
            <a
              href="#how-it-works"
              className="rounded-xl border border-violet-200 bg-white px-7 py-4 text-center font-semibold text-violet-700 transition hover:bg-violet-50"
            >
              See How It Works
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
            <span>✓ Personalized wedding plan</span>
            <span>✓ Progress tracking</span>
            <span>✓ One client portal</span>
          </div>
        </div>

        <div className="relative">
          <div className="mx-auto max-w-md rounded-[2rem] border border-violet-100 bg-white p-5 shadow-2xl shadow-violet-100">
            <div className="rounded-[1.5rem] bg-gradient-to-br from-violet-100 via-white to-amber-50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">
                    Your Wedding
                  </p>
                  <p className="mt-1 text-xl font-bold text-slate-900">
                    The Sharma Wedding
                  </p>
                </div>
                <div className="rounded-full bg-white px-3 py-1 text-xs font-bold text-violet-700 shadow-sm">
                  78%
                </div>
              </div>

              <div className="mt-6 h-3 overflow-hidden rounded-full bg-white">
                <div className="h-full w-[78%] rounded-full bg-violet-600" />
              </div>

              <div className="mt-7 grid grid-cols-2 gap-3">
                {[
                  ["Tasks", "42 / 55"],
                  ["Vendors", "8 / 10"],
                  ["Budget", "₹8.2L"],
                  ["Milestones", "12 / 15"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="mt-1 font-bold text-slate-900">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Next milestone
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="font-semibold text-slate-900">Venue Finalization</p>
                  <span className="text-sm font-medium text-violet-700">25 Aug</span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -right-3 -top-4 hidden rounded-2xl border border-violet-100 bg-white px-4 py-3 shadow-lg sm:block">
            <p className="text-xs text-slate-500">Planning status</p>
            <p className="font-bold text-emerald-600">On Track</p>
          </div>
        </div>
      </div>
    </section>
  );
}
