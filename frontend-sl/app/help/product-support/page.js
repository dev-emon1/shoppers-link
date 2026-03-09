import LegalHero from "@/components/common/footer/SectionHero";
import LegalSection from "@/components/common/footer/SectionContent";

export default function ProductSupportPage() {
  return (
    <div className="bg-bgPage py-20">
      <LegalHero
        title="Product Support"
        description="Need help with a product you purchased? Our support team is here to assist."
      />

      <div className="container max-w-4xl py-12 space-y-8">
        <LegalSection id="product-help" title="Product Issues">
          <ul className="list-disc pl-5 space-y-2">
            <li>Damaged or defective products</li>
            <li>Missing items in the package</li>
            <li>Product not matching description</li>
          </ul>
        </LegalSection>

        <LegalSection id="warranty" title="Warranty Support">
          <p>
            Some products sold on ShoppersLink include vendor or manufacturer
            warranties. Please contact the vendor directly for warranty claims.
          </p>
        </LegalSection>
      </div>
    </div>
  );
}
