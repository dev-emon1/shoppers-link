import LegalHero from "@/components/common/footer/SectionHero";
import LegalSection from "@/components/common/footer/SectionContent";

export default function BuyerProtectionPage() {
  return (
    <div className="bg-bgPage py-20">
      <LegalHero
        title="Buyer Protection"
        description="Shop confidently with ShoppersLink. Our buyer protection policy ensures safe and fair transactions."
      />

      <div className="container max-w-4xl py-12 space-y-8">
        <LegalSection id="secure-payments" title="Secure Payments">
          <p>
            All payments are processed through secure payment gateways to
            protect your financial information.
          </p>
        </LegalSection>

        <LegalSection id="refund-guarantee" title="Refund Guarantee">
          <p>
            If your product arrives damaged or significantly different from the
            listing, you can request a return or refund.
          </p>
        </LegalSection>

        <LegalSection id="dispute-support" title="Dispute Resolution">
          <p>
            If a seller refuses a valid return request, ShoppersLink will step
            in to mediate and resolve the dispute.
          </p>
        </LegalSection>
      </div>
    </div>
  );
}
