export default function ConsultationCTA() {
  return (
    <section id="consultation" className="bg-slate-950 py-24 text-white">
      <div className="celebrio-container">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 sm:p-12 lg:flex lg:items-center lg:justify-between lg:gap-12">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-300">
              Start your journey
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Let's plan a wedding worth remembering.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Start with a free consultation. We will learn about your wedding
              and help define the right planning approach.
            </p>
          </div>

          <a
            href="#home"
            className="mt-8 inline-flex shrink-0 rounded-xl bg-white px-7 py-4 font-semibold text-violet-700 transition hover:bg-violet-50 lg:mt-0"
          >
            Start Free Consultation
          </a>
        </div>
      </div>
    </section>
  );
}
