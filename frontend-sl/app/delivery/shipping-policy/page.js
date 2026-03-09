import LegalHero from "@/components/common/footer/SectionHero";
import LegalSection from "@/components/common/footer/SectionContent";

export default function ShippingPolicyPage() {
  return (
    <div className="bg-bgPage py-20">
      <LegalHero
        title="Shipping Policy"
        description="Our shipping policy explains how orders are processed and delivered across the country."
      />

      <div className="container max-w-4xl py-12 space-y-8">
        <LegalSection id="processing" title="1. Order Processing">
          <p>Orders are processed within 24 hours after confirmation.</p>

          <ul className="list-disc pl-5 space-y-2">
            <li>Orders placed before 4 PM ship the same day</li>
            <li>Orders placed after 4 PM ship next business day</li>
          </ul>
        </LegalSection>

        <LegalSection id="delivery-areas" title="2. Delivery Areas">
          <p>
            We currently deliver across all major cities and districts in
            Bangladesh.
          </p>
        </LegalSection>

        <LegalSection id="shipping-delays" title="3. Shipping Delays">
          <p>
            Delivery may be delayed due to weather, public holidays, or courier
            service disruptions.
          </p>
        </LegalSection>
      </div>
    </div>
  );
}
