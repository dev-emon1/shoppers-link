import LegalSidebar from "@/components/common/footer/SectionSidebar";

const sections = [
  { id: "agreement", title: "User Agreement" },
  { id: "account", title: "Account Registration" },
  { id: "marketplace", title: "Marketplace Rules" },
  { id: "payments", title: "Payments & Payouts" },
  { id: "shipping", title: "Shipping & Returns" },
  { id: "prohibited", title: "Prohibited Conduct" },
];

export default function LegalLayout({ children }) {
  return (
    <section className="bg-bgPage py-16">
      <div className="container grid lg:grid-cols-[260px_1fr] gap-10">
        <LegalSidebar sections={sections} />

        <main className="space-y-10">{children}</main>
      </div>
    </section>
  );
}
