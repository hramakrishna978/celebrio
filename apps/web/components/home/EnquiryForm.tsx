"use client";

import { FormEvent, useState } from "react";

export default function EnquiryForm() {
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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      // Step 1: Create customer
      const customerResponse = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
        }),
      });

      const customerData = await customerResponse.json();

      if (!customerResponse.ok) {
        throw new Error(
          customerData.error || "Failed to create customer"
        );
      }

      console.log("Customer created:", customerData);

      // Event creation will be connected in Phase 10B.
      console.log("Event details:", {
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        guestCount: formData.guestCount,
        budget: formData.budget,
      });

      setMessage(
        "Thank you! Your enquiry has been submitted successfully."
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        city: "",
        eventType: "",
        eventDate: "",
        guestCount: "",
        budget: "",
      });
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
    <section className="w-full py-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold">
            Start Planning Your Event
          </h2>

          <p className="mt-3 text-gray-600">
            Tell us about your event and our team will get in touch with you.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-6 rounded-2xl border bg-white p-8 shadow-sm md:grid-cols-2"
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
              className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
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
              className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
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
              className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
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
              className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
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
              className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
            >
              <option value="">Select event type</option>
              <option value="Wedding">Wedding</option>
              <option value="Engagement">Engagement</option>
              <option value="Reception">Reception</option>
              <option value="Birthday">Birthday</option>
              <option value="Corporate">Corporate Event</option>
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
              className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
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
              className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
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
              className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
            >
              <option value="">Select budget</option>
              <option value="Below ₹5 Lakhs">Below ₹5 Lakhs</option>
              <option value="₹5 - ₹10 Lakhs">₹5 - ₹10 Lakhs</option>
              <option value="₹10 - ₹25 Lakhs">₹10 - ₹25 Lakhs</option>
              <option value="₹25 - ₹50 Lakhs">₹25 - ₹50 Lakhs</option>
              <option value="Above ₹50 Lakhs">Above ₹50 Lakhs</option>
            </select>
          </div>

          {/* Message */}
          {message && (
            <div className="md:col-span-2 rounded-lg bg-gray-50 p-4 text-sm">
              {message}
            </div>
          )}

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg px-6 py-3 font-medium text-white disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Enquiry"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}