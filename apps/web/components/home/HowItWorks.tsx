const steps = [
  {
    number: "01",
    title: "Free Consultation",
    description:
      "Tell us about your wedding, priorities, budget and expectations. We capture everything in your Celebrio profile.",
  },
  {
    number: "02",
    title: "Choose Your Package",
    description:
      "Review your recommended service package, proposal and agreement in one place.",
  },
  {
    number: "03",
    title: "Receive Your Wedding Plan",
    description:
      "Get a personalized roadmap with milestones, tasks, timeline, vendors and budget planning.",
  },
  {
    number: "04",
    title: "We Manage the Details",
    description:
      "Your wedding PM coordinates vendors, schedules, follow-ups, documents, tasks and progress.",
  },
  {
    number: "05",
    title: "Track Progress Anytime",
    description:
      "Use your client portal to see tasks, milestones, budget, payments, documents and updates.",
  },
  {
    number: "06",
    title: "Enjoy Your Wedding",
    description:
      "Arrive at your wedding knowing the details are organized, tracked and supported.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-24">
      <div className="celebrio-container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-700">
            How it works
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            From first conversation to celebration.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            A simple, connected wedding journey without making you jump between
            different tools and platforms.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <article
              key={step.number}
              className="rounded-3xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100"
            >
              <span className="text-sm font-bold text-violet-600">{step.number}</span>
              <h3 className="mt-4 text-xl font-bold text-slate-900">{step.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
