export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="celebrio-container grid gap-10 py-14 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-700 font-bold text-white">
              C
            </span>
            <div>
              <p className="font-bold text-slate-900">Celebrio</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">
                Celebrate Every Moment
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-6 text-slate-600">
            A connected wedding management platform designed to bring planning,
            coordination and celebration together.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-slate-900">Explore</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
            <a href="#how-it-works" className="hover:text-violet-700">How It Works</a>
            <a href="#services" className="hover:text-violet-700">Services</a>
            <a href="#why-celebrio" className="hover:text-violet-700">Why Celebrio</a>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-slate-900">Planning</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
            <a href="#consultation" className="hover:text-violet-700">Free Consultation</a>
            <span>Wedding Planning</span>
            <span>Vendor Coordination</span>
            <span>Client Portal</span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100">
        <div className="celebrio-container flex flex-col gap-2 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Celebrio. All rights reserved.</p>
          <p>Celebrate Every Moment.</p>
        </div>
      </div>
    </footer>
  );
}
