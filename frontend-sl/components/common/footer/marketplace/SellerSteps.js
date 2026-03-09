import { Store, Package, Truck, CreditCard } from "lucide-react";

const steps = [
  {
    title: "Register Account",
    desc: "Create a seller account with your business details.",
    icon: Store,
  },
  {
    title: "List Products",
    desc: "Upload product information, images, and prices.",
    icon: Package,
  },
  {
    title: "Ship Orders",
    desc: "Receive orders and ship them using trusted couriers.",
    icon: Truck,
  },
  {
    title: "Get Paid",
    desc: "Receive payments directly to your seller wallet.",
    icon: CreditCard,
  },
];

export default function SellerSteps() {
  return (
    <section className="py-16">
      <div className="container max-w-5xl">
        <h2 className="text-center text-lg font-semibold text-textLight uppercase mb-10">
          How selling works
        </h2>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;

            return (
              <div key={i} className="text-center">
                <div className="w-14 h-14 rounded-xl bg-mainSoft flex items-center justify-center mx-auto mb-4">
                  <Icon size={22} className="text-main" />
                </div>

                <h3 className="font-semibold text-secondary mb-2">
                  {step.title}
                </h3>

                <p className="text-sm text-textSecondary">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
