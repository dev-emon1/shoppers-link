import LegalHero from "@/components/common/footer/SectionHero";
import LegalSection from "@/components/common/footer/SectionContent";

export default function TermsPage() {
  return (
    <>
      <LegalHero
        title="Terms & Conditions"
        description="These terms govern your use of the ShoppersLink platform. By using our service, you agree to follow these rules."
      />

      <LegalSection id="agreement" title="1. Acceptance of Agreement">
        <p>
          By creating an account or making a purchase on ShoppersLink, you
          acknowledge that you have read and agree to these terms.
        </p>

        <div className="bg-mainSoft border-l-4 border-main p-4 rounded">
          If you do not agree with these terms, please stop using the platform.
        </div>
      </LegalSection>

      <LegalSection id="account" title="2. User Account Registration">
        <ul className="list-disc pl-5 space-y-2">
          <li>Provide accurate information</li>
          <li>Maintain password security</li>
          <li>Accept responsibility for actions</li>
          <li>Verify identity when requested</li>
        </ul>
      </LegalSection>

      <LegalSection id="marketplace" title="3. Multivendor Marketplace Rules">
        <p>ShoppersLink acts as a marketplace connecting buyers and sellers.</p>
      </LegalSection>

      <LegalSection id="payments" title="4. Payments & Financial Terms">
        <p>Payments are securely processed through verified gateways.</p>
      </LegalSection>

      <LegalSection id="prohibited" title="5. Prohibited Conduct">
        <ul className="list-disc pl-5 space-y-2">
          <li>Posting fraudulent listings</li>
          <li>Using fake payment methods</li>
          <li>Scraping platform data</li>
          <li>Selling illegal products</li>
        </ul>
      </LegalSection>
    </>
  );
}
