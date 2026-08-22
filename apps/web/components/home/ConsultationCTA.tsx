"use client";

import { useState } from "react";

export default function ConsultationCTA() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
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
                Start with a free consultation. We will learn about your
                wedding and help define the right planning approach.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mt-8 inline-flex shrink-0 rounded-xl bg-white px-7 py-4 font-semibold text-violet-700 transition hover:bg-violet-50 lg:mt-0"
            >
              Start Free Consultation
            </button>
          </div>
        </div>
      </section>

      {showForm && (
        <EnquiryModal onClose={() => setShowForm(false)} />
      )}
    </>
  );
}

function EnquiryModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 text-slate-900 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-2xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          aria-label="Close enquiry form"
        >
          ×
        </button>

        <div className="pr-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-600">
            Start your journey
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight">
            Tell us about your wedding
          </h2>

          <p className="mt-2 text-slate-600">
            Share a few details and our team will get in touch with you.
          </p>
        </div>

        <EnquiryForm onSuccess={onClose} />
      </div>
    </div>
  );
}

function EnquiryForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    eventType: "",
    eventDate: "",
    guestCount: "",
    budget: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,

          eventType: formData.eventType,
          eventDate: formData.eventDate,
          guestCount: formData.guestCount,
          budget: formData.budget,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to submit enquiry"
        );
      }

      console.log("Enquiry created:", data);

      setMessage(
        "Thank you! Your enquiry has been submitted successfully."
      );

      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (error) {
      console.error("Enquiry submission error:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 grid gap-5 sm:grid-cols-2"
    >
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium"
        >
          Name
        </label>

        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Your name"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium"
        >
          Email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="you@example.com"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
        />
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="phone"
          className="mb-2 block text-sm font-medium"
        >
          Phone
        </label>

        <input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          required
          placeholder="9876543210"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
        />
      </div>

      {/* City */}
      <div>
        <label
          htmlFor="city"
          className="mb-2 block text-sm font-medium"
        >
          City
        </label>

        <input
          id="city"
          name="city"
          type="text"
          value={formData.city}
          onChange={handleChange}
          required
          placeholder="Bengaluru"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
        />
      </div>

      {/* Event Type */}
      <div>
        <label
          htmlFor="eventType"
          className="mb-2 block text-sm font-medium"
        >
          Event Type
        </label>

        <select
          id="eventType"
          name="eventType"
          value={formData.eventType}
          onChange={handleChange}
          required
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
        >
          <option value="">Select event type</option>
          <option value="Wedding">Wedding</option>
          <option value="Engagement">Engagement</option>
          <option value="Reception">Reception</option>
          <option value="Birthday">Birthday</option>
          <option value="Corporate Event">
            Corporate Event
          </option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Event Date */}
      <div>
        <label
          htmlFor="eventDate"
          className="mb-2 block text-sm font-medium"
        >
          Event Date
        </label>

        <input
          id="eventDate"
          name="eventDate"
          type="date"
          value={formData.eventDate}
          onChange={handleChange}
          required
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
        />
      </div>

      {/* Guest Count */}
      <div>
        <label
          htmlFor="guestCount"
          className="mb-2 block text-sm font-medium"
        >
          Guest Count
        </label>

        <input
          id="guestCount"
          name="guestCount"
          type="number"
          min="1"
          value={formData.guestCount}
          onChange={handleChange}
          required
          placeholder="200"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
        />
      </div>

      {/* Budget */}
      <div>
        <label
          htmlFor="budget"
          className="mb-2 block text-sm font-medium"
        >
          Budget
        </label>

        <select
          id="budget"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          required
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
        >
          <option value="">Select budget</option>
          <option value="500000">Below ₹5 Lakhs</option>
          <option value="750000">₹5 - ₹10 Lakhs</option>
          <option value="1500000">₹10 - ₹25 Lakhs</option>
          <option value="3500000">₹25 - ₹50 Lakhs</option>
          <option value="5000000">Above ₹50 Lakhs</option>
        </select>
      </div>

      {/* Message */}
      {message && (
        <div className="sm:col-span-2 rounded-xl bg-slate-100 p-4 text-sm">
          {message}
        </div>
      )}

      {/* Submit */}
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-violet-600 px-6 py-3.5 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Enquiry"}
        </button>
      </div>
    </form>
  );
}