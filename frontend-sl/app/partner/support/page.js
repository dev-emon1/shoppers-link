import LegalHero from "@/components/common/footer/SectionHero";
import LegalSection from "@/components/common/footer/SectionContent";
import { Mail, Phone, MessageCircle } from "lucide-react";

export default function SellerSupportPage() {
  return (
    <div className="bg-bgPage">
      <LegalHero
        title="Seller Support"
        description="Need help managing your seller account or orders? Our support team is here to assist you."
      />

      <div className="container max-w-4xl py-12 space-y-8">
        <LegalSection id="support-channels" title="1. Support Channels">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 border border-border rounded-xl text-center">
              <Mail className="text-main mx-auto mb-3" size={28} />

              <h4 className="font-semibold mb-2">Email Support</h4>

              <p className="text-sm text-textSecondary">
                partners@shopperslink.com
              </p>
            </div>

            <div className="p-6 border border-border rounded-xl text-center">
              <Phone className="text-main mx-auto mb-3" size={28} />

              <h4 className="font-semibold mb-2">Phone Support</h4>

              <p className="text-sm text-textSecondary">+880 1401-446644</p>
            </div>

            <div className="p-6 border border-border rounded-xl text-center">
              <MessageCircle className="text-main mx-auto mb-3" size={28} />

              <h4 className="font-semibold mb-2">Live Chat</h4>

              <p className="text-sm text-textSecondary">
                Available inside seller dashboard
              </p>
            </div>
          </div>
        </LegalSection>

        <LegalSection id="seller-resources" title="2. Seller Resources">
          <ul className="list-disc pl-5 space-y-2">
            <li>Product listing guidelines</li>
            <li>Order fulfillment instructions</li>
            <li>Return & refund process</li>
            <li>Payment and commission details</li>
          </ul>
        </LegalSection>

        <LegalSection id="response-time" title="3. Response Time">
          <p>
            Our seller support team typically responds to inquiries within 24
            hours on business days.
          </p>

          <p>
            For urgent issues such as order disputes or payment delays, please
            contact support via phone or dashboard chat.
          </p>
        </LegalSection>
      </div>
    </div>
  );
}
