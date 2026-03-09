import MarketplaceHero from "@/components/common/footer/marketplace/MarketplaceHero";
import SellerSteps from "@/components/common/footer/marketplace/SellerSteps";
import SellerBenefits from "@/components/common/footer/marketplace/SellerBenefits";

export default function BecomeSellerPage() {
  return (
    <div className="bg-bgPage">
      <MarketplaceHero
        badge="SELL WITH US"
        title="Become a Seller"
        description="Join ShoppersLink marketplace and reach thousands of customers across the country."
      />

      <SellerSteps />

      <SellerBenefits />
    </div>
  );
}
