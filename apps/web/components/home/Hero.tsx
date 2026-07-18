export default function Hero() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <div className="max-w-5xl">
        <p className="mb-4 text-lg font-semibold uppercase tracking-widest text-purple-700">
          Celebrio
        </p>

        <h1 className="text-5xl font-bold leading-tight text-gray-900 md:text-7xl">
          Celebrate Every Moment
        </h1>

        <p className="mt-8 text-xl leading-9 text-gray-600">
          Plan your dream wedding with confidence. Discover trusted vendors,
          manage budgets, track every milestone, and create unforgettable
          memories—all from one platform.
        </p>

        <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
          <button className="rounded-xl bg-purple-700 px-8 py-4 font-semibold text-white transition hover:bg-purple-800">
            Start Planning
          </button>

          <button className="rounded-xl border border-purple-700 px-8 py-4 font-semibold text-purple-700 transition hover:bg-purple-50">
            Explore Vendors
          </button>
        </div>
      </div>
    </section>
  );
}