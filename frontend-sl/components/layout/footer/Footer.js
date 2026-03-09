import Link from "next/link";
import Image from "next/image";
import {
  FaFacebook,
  FaInstagram,
  FaPinterest,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa6";

import fingertips from "@/public/images/fingertips.png";
import { footerLinks } from "./footer.data";

export default function Footer() {
  return (
    <footer className="bg-[#f3f3f3] text-secondary py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 border-b border-white pb-10">
        {footerLinks.map((section) => (
          <div key={section.title}>
            <h3 className="font-semibold text-lg mb-4">{section.title}</h3>

            <ul className="space-y-2 text-sm text-secondaryActive">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-main transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact Section */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Helpline</h3>

          <ul className="space-y-2 text-sm text-secondaryActive">
            <li className="flex flex-col gap-1">
              <span className="font-medium">Email:</span>

              <a
                href="mailto:info@fingertipsinnovations.com"
                className="hover:text-main break-all"
              >
                info@fingertipsinnovations.com
              </a>
            </li>

            <li>
              <span className="block font-medium">Phone:</span>

              <a href="tel:+8801401446644" className="hover:text-main">
                +880 1401-446644
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
        <p className="tracking-[0.2em] text-xs text-text-secondaryActive flex items-center gap-2 text-center">
          &copy; 2026 Shoppers Link. All Rights Reserved | Developed by
          <Link
            href="https://fingertipsinnovations.com/"
            target="_blank"
            prefetch={false}
          >
            <Image src={fingertips} alt="Fingertips" className="w-28" />
          </Link>
        </p>

        {/* Social */}
        <div className="flex space-x-5">
          <FaFacebook className="w-5 h-5 hover:text-[#3b5998] cursor-pointer" />
          <FaTwitter className="w-5 h-5 hover:text-[#3b5998] cursor-pointer" />
          <FaYoutube className="w-5 h-5 hover:text-[#3b5998] cursor-pointer" />
          <FaPinterest className="w-5 h-5 hover:text-[#3b5998] cursor-pointer" />
          <FaInstagram className="w-5 h-5 hover:text-[#3b5998] cursor-pointer" />
          <FaTiktok className="w-5 h-5 hover:text-[#3b5998] cursor-pointer" />
        </div>
      </div>
    </footer>
  );
}
