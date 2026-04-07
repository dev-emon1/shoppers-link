export const footerLinks = [
  {
    title: "Help",
    links: [
      { label: "Contact Us", href: "/help/contact" },
      { label: "Customer Service", href: "/help/customer-service" },
      { label: "Product Support", href: "/help/product-support" },
      { label: "Buyer Protection", href: "/help/buyer-protection" },
    ],
  },
  {
    title: "Delivery",
    links: [
      { label: "Delivery Information", href: "/delivery/info" },
      { label: "Track Your Order", href: "/delivery/track-order" },
      { label: "Returns & Refunds", href: "/legal/return-refund" },
      { label: "Shipping Policy", href: "/delivery/shipping-policy" },
    ],
  },
  {
    title: "Shopping",
    links: [
      { label: "My Account", href: "/user/account" },
      { label: "Cart", href: "/cart" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Brands A-Z", href: "/brands" },
      { label: "Offers", href: "/shopping/offers" },
    ],
  },
  {
    title: "Marketplace",
    links: [
      { label: "Become a Partner", href: "/partner/become-partner" },
      {
        label: "Partner Login",
        href: `${process.env.NEXT_PUBLIC_PARTNER_PORTAL_URL || "#"}`,
      },
      { label: "Partner Policy", href: "/partner/policy" },
      { label: "Partner Support", href: "/partner/support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/legal/privacy-policy" },
      { label: "Terms & Conditions", href: "/legal/terms-conditions" },
      { label: "Return & Refund Policy", href: "/legal/return-refund" },
    ],
  },
];
