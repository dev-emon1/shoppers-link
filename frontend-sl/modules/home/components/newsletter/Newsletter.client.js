"use client";

import Link from "next/link";
import { useState } from "react";

export default function NewsletterClient() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Subscribed with:", email);
    setEmail("");
  };

  return (
    <section className="relative py-24 bg-gradient-to-br from-bgSurface via-bgPage to-bgSurface overflow-hidden">
      {/* Decorative radial gradient overlay */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,#E07D42_0%,transparent_40%),radial-gradient(circle_at_20%_10%,#3A2767_0%,transparent_5%)]"></div>

      {/* Subtle background blur layer */}
      <div className="absolute inset-0 backdrop-blur-[2px]"></div>

      <div className="container relative z-10">
        {/* Section heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-textPrimary">
            Stay Connected & Grow Together
          </h2>
          <p className="mt-3 text-textSecondary max-w-2xl mx-auto">
            Whether you’re a customer looking for deals or a Partner ready to
            sell, our community keeps you updated and inspired every day.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Newsletter card */}
          <div className="bg-bgSurface p-10 rounded-2xl shadow-lg border border-border hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-semibold text-textPrimary">
              Subscribe to Our Newsletter
            </h3>

            <p className="mt-3 text-textSecondary leading-relaxed">
              Get the latest Partner arrivals, exclusive offers, and curated
              product news delivered to your inbox.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-4 py-3 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-main"
              />

              <button
                type="submit"
                className="px-6 py-3 bg-main hover:bg-mainHover active:bg-mainActive text-white font-medium rounded-md transition"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Partner CTA */}
          <div className="relative bg-gradient-to-br from-secondary via-secondaryHover to-secondaryActive text-white rounded-2xl p-10 shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_70%_30%,#E07D42_0%,transparent_60%)] rounded-2xl"></div>

            <div className="relative z-10">
              <h3 className="text-2xl font-semibold">Become a Partner</h3>

              <p className="mt-3 text-textSecondaryDark leading-relaxed">
                Start selling on our marketplace and reach thousands of
                customers nationwide. Get discovered by more buyers every day.
              </p>

              <button className="mt-6 bg-main hover:bg-mainHover active:bg-mainActive text-white font-medium px-6 py-3 rounded-md transition">
                <Link
                  href={`${process.env.NEXT_PUBLIC_CLIENT_ACCESS_URL}/login`}
                  target="_blank"
                >
                  Join as Partner
                </Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
