import { Mail, Phone, MapPin } from "lucide-react";
import LegalHero from "@/components/common/footer/SectionHero";
import LegalSection from "@/components/common/footer/SectionContent";

export default function ContactPage() {
  return (
    <div className="bg-bgPage py-20">
      <LegalHero
        title="Contact Us"
        description="Have questions or need assistance? Our support team is here to help you."
      />

      <div className="container max-w-4xl py-12 space-y-8">
        <LegalSection id="contact-info" title="Customer Support Channels">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 border border-border rounded-xl text-center">
              <Mail className="text-main mx-auto mb-3" size={26} />
              <h4 className="font-semibold mb-2">Email</h4>
              <p className="text-sm text-textSecondary">
                support@shopperslink.com
              </p>
            </div>

            <div className="p-6 border border-border rounded-xl text-center">
              <Phone className="text-main mx-auto mb-3" size={26} />
              <h4 className="font-semibold mb-2">Phone</h4>
              <p className="text-sm text-textSecondary">+880 1401-446644</p>
            </div>

            <div className="p-6 border border-border rounded-xl text-center">
              <MapPin className="text-main mx-auto mb-3" size={26} />
              <h4 className="font-semibold mb-2">Office</h4>
              <p className="text-sm text-textSecondary">Dhaka, Bangladesh</p>
            </div>
          </div>
        </LegalSection>
      </div>
    </div>
  );
}
