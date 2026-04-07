import { Users, TrendingUp, ShieldCheck } from "lucide-react";

const benefits = [
  {
    title: "Reach More Customers",
    desc: "Access thousands of active shoppers across the platform.",
    icon: Users,
  },
  {
    title: "Grow Your Business",
    desc: "Powerful tools to manage inventory, pricing, and orders.",
    icon: TrendingUp,
  },
  {
    title: "Secure Payments",
    desc: "Transparent payment system with secure vendor payouts.",
    icon: ShieldCheck,
  },
];

export default function SellerBenefits() {
  return (
    <section className="py-16 bg-bgSurface border-y border-border">
      <div className="container max-w-5xl">
        <h2 className="text-center text-2xl font-bold text-secondary mb-12">
          Why Sell on ShoppersLink?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((item, i) => {
            const Icon = item.icon;

            return (
              <div
                key={i}
                className="p-6 border border-border rounded-xl text-center hover:shadow-sm transition"
              >
                <Icon size={26} className="text-main mx-auto mb-4" />

                <h3 className="font-semibold text-secondary mb-2">
                  {item.title}
                </h3>

                <p className="text-sm text-textSecondary">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
