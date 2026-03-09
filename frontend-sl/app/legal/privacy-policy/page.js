import PolicySection from "@/components/common/footer/PolicySection";

export default function PrivacyPolicyPage() {
  return (
    <PolicySection
      title="Privacy Policy"
      description="Your privacy is important to us. This policy explains how we collect, use, and protect your personal information when using ShoppersLink."
      sections={[
        {
          heading: "Information We Collect",
          list: [
            "Name and contact information",
            "Shipping and billing address",
            "Order history and transaction data",
            "Account login information",
          ],
        },
        {
          heading: "How We Use Your Information",
          list: [
            "To process orders and payments",
            "To improve our services and user experience",
            "To provide customer support",
            "To communicate important updates",
          ],
        },
        {
          heading: "Data Protection",
          text: "We use secure systems and encryption technologies to ensure your personal data remains protected.",
        },
      ]}
    />
  );
}
