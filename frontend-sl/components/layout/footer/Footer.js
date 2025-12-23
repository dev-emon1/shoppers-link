import {
  FaFacebook,
  FaInstagram,
  FaPinterest,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa6";
import Image from "next/image";
import fingertips from "@/public/images/fingertips.png";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#f3f3f3] text-secondary py-12 px-6">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-white pb-10">
        {/* Help */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Help</h3>
          <ul className="space-y-2 text-sm text-secondaryActive">
            <li>Contact us</li>
            <li>Customer services</li>
            <li>Product support</li>
            <li>Our shops</li>
            <li>Price promise</li>
          </ul>

          <h3 className="font-semibold text-lg mt-6 mb-4">Delivery</h3>
          <ul className="space-y-2 text-sm text-secondaryActive">
            <li>Delivery & collection</li>
            <li>Track your order</li>
            <li>Returns & refunds</li>
          </ul>
        </div>

        {/* Shopping */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Shopping</h3>
          <ul className="space-y-2 text-sm text-secondaryActive">
            <li>Gift Cards & vouchers</li>
            <li>My ShoppersLink</li>
            <li>Cart</li>
            <li>Wish List</li>
            <li>Brands A–Z</li>
            <li>Offers</li>
          </ul>
        </div>

        {/* More from us */}
        <div>
          <h3 className="font-semibold text-lg mb-4">More from us</h3>
          <ul className="space-y-2 text-sm text-secondaryActive">
            <li>Jobs</li>
            <li>ShoppersLink & Partners</li>
            <li>About the ShoppersLink Partnership</li>
            <li>ShoppersLink for Business</li>
            <li>Happier futures</li>
            <li>Protect+</li>
          </ul>
        </div>

        {/* ShoppersLink Money */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Shoppers Link Money</h3>
          <ul className="space-y-2 text-sm text-secondaryActive mb-4">
            <li>Payment plans</li>
            <li>Partnership Credit Card</li>
            <li>Travel money</li>
            <li>Loans</li>
          </ul>

          {/* Contact Info */}

          <h3 className="font-semibold text-lg mb-4">Helpline</h3>
          <ul className="space-y-2 text-sm text-secondaryActive">
            <li>
              <span className="block font-medium">Email:</span>
              <a
                className="text-secondaryActive hover:text-main"
                href="mailto:info@fingertipsinnovations.com"
              >
                info@fingertipsinnovations.com
              </a>
            </li>
            <li>
              <span className="block font-medium">Phone:</span>
              <a
                className="text-secondaryActive hover:text-main"
                href="tel:+8801401446644"
              >
                +880 1401-446644
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
        <p
          className="tracking-[0.2em] text-xs text-text-secondaryActive text-center flex
            items-center gap-2"
        >
          &copy; 2025 Shoppers Link. All Rights Reserved | Developed by
          <Link
            href={"https://fingertipsinnovations.com/"}
            target="_blank"
            className="inline-block"
          >
            <Image src={fingertips} alt={"Fingertips"} className="w-28" />
          </Link>
        </p>

        {/* Social Icons */}
        <div className="flex space-x-5">
          <FaFacebook
            size={28}
            className="w-5 h-5 hover:text-[#3b5998] cursor-pointer"
          />
          <FaTwitter className="w-5 h-5  hover:text-[#3b5998] cursor-pointer" />
          <FaYoutube className="w-5 h-5 hover:text-[#3b5998] cursor-pointer" />
          <FaPinterest className="w-5 h-5 hover:text-[#3b5998] cursor-pointer" />
          <FaInstagram className="w-5 h-5 hover:text-[#3b5998] cursor-pointer" />
          <FaTiktok className="w-5 h-5 hover:text-[#3b5998] cursor-pointer" />
        </div>
      </div>
    </footer>
  );
}
