"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "CUSTOMER" | "STAFF";
};

const links = [
  { label: "Home", href: "#home" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Services", href: "#services" },
  { label: "Why Celebrio", href: "#why-celebrio" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          setUser(null);
          return;
        }

        const data = await response.json();

        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Unable to load user:", error);
        setUser(null);
      } finally {
        setCheckingAuth(false);
      }
    }

    loadUser();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      setUser(null);
      setProfileOpen(false);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  const firstName = user?.name?.split(" ")[0] || "User";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="celebrio-container flex h-20 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
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
        </Link>

        {/* Desktop Navigation */}
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

        {/* Desktop Right Side */}
        <div className="hidden items-center gap-3 md:flex">
          {checkingAuth ? (
            <div className="h-10 w-24 animate-pulse rounded-xl bg-slate-100" />
          ) : user ? (
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 transition hover:border-violet-200 hover:bg-violet-50"
              >
                {/* Avatar */}
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
                  {user.name.charAt(0).toUpperCase()}
                </span>

                <span className="text-left">
                  <span className="block text-sm font-semibold text-slate-900">
                    Hi, {firstName}
                  </span>

                  <span className="block text-xs text-slate-500">
                    {user.role === "ADMIN" ? "Administrator" : "Customer"}
                  </span>
                </span>

                <span className="ml-1 text-xs text-slate-400">
                  {profileOpen ? "▲" : "▼"}
                </span>
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-14 z-50 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                  <div className="border-b border-slate-100 px-3 py-3">
                    <p className="text-sm font-semibold text-slate-900">
                      {user.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {user.email}
                    </p>
                  </div>

                  {user.role === "ADMIN" ? (
                    <Link
                      href="/admin"
                      onClick={() => setProfileOpen(false)}
                      className="mt-2 block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-700"
                    >
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/"
                      onClick={() => setProfileOpen(false)}
                      className="mt-2 block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-700"
                    >
                      My Celebrio
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-1 w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/signin"
                className="rounded-xl border border-violet-200 px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
              >
                Sign In
              </Link>

              <Link
                href="/register"
                className="rounded-xl bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800"
              >
                Create Account
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
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

      {/* Mobile Menu */}
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

            {user ? (
              <>
                <div className="mt-4 rounded-xl bg-violet-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    Hi, {user.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {user.email}
                  </p>
                </div>

                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="mt-3 rounded-xl border border-violet-200 px-5 py-3 text-center text-sm font-semibold text-violet-700"
                  >
                    Admin Dashboard
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-3 rounded-xl bg-red-50 px-5 py-3 text-center text-sm font-semibold text-red-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  onClick={() => setOpen(false)}
                  className="mt-4 rounded-xl border border-violet-200 px-5 py-3 text-center text-sm font-semibold text-violet-700"
                >
                  Sign In
                </Link>

                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="mt-3 rounded-xl bg-violet-700 px-5 py-3 text-center text-sm font-semibold text-white"
                >
                  Create Account
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}