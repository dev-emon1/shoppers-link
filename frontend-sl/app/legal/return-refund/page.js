"use client";
import React from "react";
import {
  RotateCcw,
  PackageCheck,
  CreditCard,
  Truck,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ChevronRight,
  MessageSquare,
  FileSearch,
} from "lucide-react";

const RefundReturnPolicy = () => {
  const steps = [
    {
      title: "Request Return",
      desc: "Initiate return from your order history within 7 days of delivery.",
      icon: <RotateCcw className="text-main" size={24} />,
    },
    {
      title: "Vendor Approval",
      desc: "The specific vendor reviews your request and provides a return label.",
      icon: <FileSearch className="text-secondary" size={24} />,
    },
    {
      title: "Ship Item",
      desc: "Drop off the package. Must be in original condition with tags.",
      icon: <Truck className="text-mainHover" size={24} />,
    },
    {
      title: "Get Refund",
      desc: "Receive funds in your original payment method within 5-10 days.",
      icon: <CreditCard className="text-secondary" size={24} />,
    },
  ];

  return (
    <div className="min-h-screen bg-bgPage text-textPrimary">
      {/* Header */}
      <header className="pt-16 pb-16 px-6 text-center border-b border-border bg-bgSurface">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-mainSoft text-main text-xs font-semibold uppercase tracking-wider mb-4">
            <RotateCcw size={14} />
            Hassle-Free Returns
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-6">
            Refund & Return Policy
          </h1>

          <p className="text-textSecondary max-w-2xl mx-auto leading-relaxed">
            Not happy with your purchase? We've made our return process simple
            and transparent. Learn how you can request a return and receive your
            refund quickly.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Workflow */}
        <section className="mb-16">
          <h2 className="text-lg font-semibold mb-10 text-center uppercase tracking-widest text-textLight">
            How it works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative text-center group">
                <div className="w-16 h-16 rounded-2xl bg-bgSurface border border-border flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition">
                  {step.icon}
                </div>

                <h3 className="font-semibold text-secondary mb-2">
                  {step.title}
                </h3>

                <p className="text-sm text-textSecondary leading-relaxed">
                  {step.desc}
                </p>

                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-border" />
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Policy */}
          <div className="lg:col-span-2 space-y-8">
            <div className="p-8 rounded-3xl border border-border bg-bgSurface">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-secondary">
                <PackageCheck className="text-main" />
                Return Eligibility
              </h3>

              <div className="space-y-4">
                <div className="flex gap-4 p-4 rounded-xl bg-bgPage">
                  <CheckCircle2 className="text-green shrink-0" size={20} />

                  <div>
                    <h4 className="font-semibold text-sm">
                      Valid Reasons for Return
                    </h4>

                    <p className="text-sm text-textSecondary mt-1">
                      Damaged items, wrong size/color, missing parts, or
                      products that significantly differ from the description.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-xl bg-bgPage">
                  <XCircle className="text-red shrink-0" size={20} />

                  <div>
                    <h4 className="font-semibold text-sm">
                      Non-Returnable Items
                    </h4>

                    <p className="text-sm text-textSecondary mt-1">
                      Perishable goods, custom-made products, personal care
                      items, and opened software.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold mt-12 mb-6 flex items-center gap-3 text-secondary">
                <CreditCard className="text-main" />
                Refund Methods
              </h3>

              <p className="text-textSecondary text-sm leading-relaxed mb-6">
                After the vendor receives and verifies your returned product,
                the refund will be issued to your original payment method.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-border rounded-xl">
                  <span className="text-xs font-semibold text-textLight uppercase">
                    Credit/Debit Card
                  </span>
                  <p className="font-bold text-lg text-secondary">5-7 Days</p>
                </div>

                <div className="p-4 border border-border rounded-xl">
                  <span className="text-xs font-semibold text-textLight uppercase">
                    Mobile Wallets
                  </span>
                  <p className="font-bold text-lg text-secondary">
                    24-48 Hours
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-main text-white shadow-lg">
              <h4 className="text-xl font-bold mb-3">Shopper Protection</h4>

              <p className="text-sm opacity-90 mb-6 leading-relaxed">
                If a vendor refuses a valid return request, ShoppersLink will
                step in to resolve the dispute and ensure a fair outcome.
              </p>

              <button className="w-full py-3 bg-white text-main font-semibold rounded-xl hover:bg-mainSoft transition">
                Open a Dispute
              </button>
            </div>

            <div className="p-6 rounded-3xl border border-border bg-bgSurface">
              <h4 className="font-semibold mb-4 flex items-center gap-2 text-secondary">
                <HelpCircle size={18} className="text-main" />
                Common Questions
              </h4>

              <div className="space-y-4">
                <details className="group">
                  <summary className="text-sm font-medium cursor-pointer list-none flex items-center justify-between">
                    Who pays for shipping?
                    <ChevronRight
                      size={14}
                      className="group-open:rotate-90 transition-transform"
                    />
                  </summary>

                  <p className="text-xs text-textSecondary mt-2">
                    If the item is faulty, the vendor pays. For change of mind
                    returns, the shopper pays shipping.
                  </p>
                </details>

                <details className="group">
                  <summary className="text-sm font-medium cursor-pointer list-none flex items-center justify-between">
                    Can I exchange items?
                    <ChevronRight
                      size={14}
                      className="group-open:rotate-90 transition-transform"
                    />
                  </summary>

                  <p className="text-xs text-textSecondary mt-2">
                    Exchanges depend on vendor stock availability.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </div>

        {/* Support CTA */}

        <section className="mt-20 text-center">
          <div className="p-10 rounded-[3rem] border-2 border-dashed border-border">
            <div className="w-12 h-12 bg-mainSoft text-main rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={24} />
            </div>

            <h3 className="text-2xl font-bold mb-2 text-secondary">
              Still need help?
            </h3>

            <p className="text-textSecondary mb-8 max-w-md mx-auto">
              Our support team is available to assist you with your return or
              refund request.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-3 bg-main text-white rounded-2xl font-semibold text-sm hover:bg-mainHover transition">
                Chat with Support
              </button>

              <button className="px-8 py-3 border border-border rounded-2xl font-semibold text-sm hover:bg-bgPage">
                Email Returns Team
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RefundReturnPolicy;
