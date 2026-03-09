import LegalHero from "@/components/common/footer/SectionHero";
import LegalSection from "@/components/common/footer/SectionContent";

export default function DeliveryInfoPage() {
  return (
    <div className="bg-bgPage py-20">
      <LegalHero
        title="Delivery Information"
        description="Learn about delivery times, charges, and shipping partners used by ShoppersLink marketplace."
      />

      <div className="container max-w-4xl py-12 space-y-8">
        <LegalSection id="delivery-time" title="1. Delivery Time">
          <ul className="list-disc pl-5 space-y-2">
            <li>Inside Dhaka: 1–2 business days</li>
            <li>Outside Dhaka: 2–4 business days</li>
            <li>Remote areas: 3–5 business days</li>
          </ul>
        </LegalSection>

        <LegalSection id="delivery-charge" title="2. Delivery Charges">
          <p>
            Delivery charges depend on the product category, seller location,
            and delivery destination.
          </p>

          <ul className="list-disc pl-5 space-y-2">
            <li>Inside Dhaka: ৳80</li>
            <li>Outside Dhaka: ৳120</li>
            <li>Free delivery on selected promotions</li>
          </ul>
        </LegalSection>

        <LegalSection id="courier-partners" title="3. Courier Partners">
          <p>
            We work with trusted logistics partners to ensure safe and timely
            delivery.
          </p>

          <ul className="list-disc pl-5 space-y-2">
            <li>Pathao Courier</li>
            <li>Steadfast Courier</li>
            <li>RedX Logistics</li>
          </ul>
        </LegalSection>
      </div>
    </div>
  );
}
