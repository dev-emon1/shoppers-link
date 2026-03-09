import LegalHero from "@/components/common/footer/SectionHero";
import LegalSection from "@/components/common/footer/SectionContent";

export default function CustomerServicePage() {
  return (
    <div className="bg-bgPage py-20">
      <LegalHero
        title="Customer Service"
        description="Learn how ShoppersLink helps customers with orders, returns, and account management."
      />

      <div className="container max-w-4xl py-12 space-y-8">
        <LegalSection id="order-help" title="Order Assistance">
          <ul className="list-disc pl-5 space-y-2">
            <li>Track your order status</li>
            <li>Cancel orders before shipping</li>
            <li>Request returns or refunds</li>
          </ul>
        </LegalSection>

        <LegalSection id="account-help" title="Account Support">
          <ul className="list-disc pl-5 space-y-2">
            <li>Update profile information</li>
            <li>Manage delivery addresses</li>
            <li>Reset password and security settings</li>
          </ul>
        </LegalSection>
      </div>
    </div>
  );
}
