"use client";

import { useState } from "react";
import { Mail, Phone, MessageCircle, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

export default function SupportPage() {
  const [faqOpen, setFaqOpen] = useState(null);

  const toggleFAQ = (i) => {
    setFaqOpen(faqOpen === i ? null : i);
  };

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const faqs = [
    {
      q: "How can I track my order?",
      a: "You can track your order from your dashboard under 'Orders'. You will also receive SMS/email updates.",
    },
    {
      q: "What is the return policy?",
      a: "Most items can be returned within 7 days. Some items follow brand warranties.",
    },
    {
      q: "How long does delivery take?",
      a: "Delivery typically takes 1–3 business days inside Dhaka, and 3–5 days outside.",
    },
    {
      q: "Can I change or cancel my order?",
      a: "You can cancel orders before they are shipped. Contact support if already shipped.",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent! Our support team will contact you.");
    setForm({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
  };

  return (
    <div className="container py-12 space-y-12">
      {/* PAGE HEADER */}
      <div className="text-center">
        <h1 className="text-3xl font-semibold mb-2">Help & Support</h1>
        <p className="text-gray-600">
          We are here to help you. Find answers or reach out to our support
          team.
        </p>
      </div>

      {/* SUPPORT OPTIONS */}
      <div className="grid md:grid-cols-3 gap-6">
        <SupportCard
          icon={<Mail size={24} />}
          title="Email Support"
          text="support@shopperslink.com"
        />

        <SupportCard
          icon={<Phone size={24} />}
          title="Call Us"
          text="+880 1700 000000"
        />

        <SupportCard
          icon={<MessageCircle size={24} />}
          title="WhatsApp"
          text="+880 1700 000000"
        />
      </div>

      {/* FAQ SECTION */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((item, i) => (
            <div
              key={i}
              className="border rounded-xl p-4 cursor-pointer bg-white shadow-sm"
              onClick={() => toggleFAQ(i)}
            >
              <div className="flex justify-between items-center">
                <p className="font-medium">{item.q}</p>
                <ChevronDown
                  size={20}
                  className={`transition-transform ${
                    faqOpen === i ? "rotate-180" : ""
                  }`}
                />
              </div>

              {faqOpen === i && (
                <p className="mt-3 text-gray-600 text-sm">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CONTACT FORM */}
      <div className="bg-white border rounded-xl shadow-sm p-8 max-w-xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Send us a message</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Full Name"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
          />

          <InputField
            label="Email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
          />

          <InputField
            label="Phone"
            value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
          />

          <div>
            <label className="text-sm font-medium">Message</label>
            <textarea
              rows="4"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="mt-1 w-full border rounded-lg p-3 outline-none focus:border-main"
              placeholder="Write your message..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-main text-white py-3 rounded-xl hover:bg-mainHover transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

/* SUPPORT CARD COMPONENT */
function SupportCard({ icon, title, text }) {
  return (
    <div className="bg-white p-6 border rounded-xl shadow-sm flex flex-col items-center text-center space-y-3 hover:shadow-md transition">
      <div className="text-main">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-gray-600 text-sm">{text}</p>
    </div>
  );
}

/* INPUT FIELD COMPONENT */
function InputField({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg p-3 outline-none focus:border-main mt-1"
        placeholder={`Enter your ${label.toLowerCase()}`}
      />
    </div>
  );
}
