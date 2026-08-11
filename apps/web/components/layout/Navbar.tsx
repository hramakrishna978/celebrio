"use client";

import { useState } from "react";

const links = [
  { label: "Home", href: "#home" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Services", href: "#services" },
  { label: "Why Celebrio", href: "#why-celebrio" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="celebrio-container flex h-20 items-center justify-between">
        <a href="#home" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-700 text-lg font-bold text-white">
            C
          </span>
          <span>
            <span className="block text-xl font-bold tracking-tight text-slate-900">
              Celebrio
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-700">
              Celebrate Every Moment
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition hover:text-violet-700"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#consultation"
            className="rounded-xl border border-violet-200 px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
          >
            Sign In
          </a>
          <a
            href="#consultation"
            className="rounded-xl bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800"
          >
            Start Planning
          </a>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="rounded-lg border border-slate-200 p-2 md:hidden"
        >
          <span className="block h-0.5 w-5 bg-slate-800" />
          <span className="mt-1.5 block h-0.5 w-5 bg-slate-800" />
          <span className="mt-1.5 block h-0.5 w-5 bg-slate-800" />
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white md:hidden">
          <nav className="celebrio-container flex flex-col py-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-slate-100 py-4 text-sm font-medium text-slate-700"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#consultation"
              onClick={() => setOpen(false)}
              className="mt-4 rounded-xl bg-violet-700 px-5 py-3 text-center text-sm font-semibold text-white"
            >
              Start Planning
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
