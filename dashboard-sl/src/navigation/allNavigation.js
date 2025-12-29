import { LuLayoutDashboard } from "react-icons/lu";
import {
  FaCartArrowDown,
  FaShippingFast,
  FaUsersCog,
  FaUserTag,
} from "react-icons/fa";
import { MdInventory2, MdOutlineSecurity } from "react-icons/md";
import { PiMoneyBold } from "react-icons/pi";
import { RiCoupon3Fill } from "react-icons/ri";
import { TbReportSearch } from "react-icons/tb";
import { IoChatbox } from "react-icons/io5";
import { BiBookContent } from "react-icons/bi";
import { IoIosSettings } from "react-icons/io";

export const allNavigation = {

  vendor: [
    {
      name: "Dashboard",
      path: "/vendor/dashboard",
      icon: LuLayoutDashboard,
      role: "vendor",
      children: [
        { name: "Overview", path: "/vendor/dashboard/overview" },
        // { name: "Sales Analytics", path: "/vendor/dashboard/sales-analytics" },
      ],
    },
    {
      name: "Product Management",
      path: "/vendor/products",
      icon: MdInventory2,
      role: "vendor",
      children: [
        { name: "All Products", path: "/vendor/products/all-products" },
        { name: "Feature Product", path: "/vendor/products/feature-product" },
      ],
    },
    {
      name: "Order Management",
      path: "/vendor/orders",
      icon: FaCartArrowDown,
      role: "vendor",
      children: [
        { name: "Order List", path: "/vendor/orders/order-list" },
        { name: "Refund Requests", path: "/vendor/orders/refund-requests" },
        { name: "Return Management", path: "/vendor/orders/return-management" },
      ],
    },
    {
      name: "Inventory Management",
      path: "/vendor/invendory",
      icon: FaCartArrowDown,
      role: "vendor",
      children: [
        // { name: "All Inventory", path: "/vendor/inventory/inventory-list" },
        { name: "Re Stock", path: "/vendor/inventory/inventory-create" },
      ],
    },
    {
      name: "Payment Management",
      path: "/vendor/payments",
      icon: PiMoneyBold,
      role: "vendor",
      children: [
        { name: "Payment Gateways", path: "/vendor/payments/gateways" },
        { name: "Invoices", path: "/vendor/payments/invoices" },
        {
          name: "Transaction",
          path: "/vendor/payments/transactions",
        },
        // { name: "Payouts", path: "/vendor/payments/payouts" },
        // { name: "Refunds", path: "/vendor/payments/refunds" },
        // { name: "Commissions Settings", path: "/vendor/payments/commissions" },
      ],
    },
    {
      name: "Reports & Analytics",
      path: "/vendor/reports",
      icon: TbReportSearch,
      role: "vendor",
      children: [
        { name: "Sales Reports", path: "/vendor/reports/sales" },
        { name: "Inventory Reports", path: "/vendor/reports/inventory" },
        {
          name: "Product Performance",
          path: "/vendor/reports/product-performance",
        },
        // { name: "Customer Reports", path: "/vendor/reports/customers" },
        { name: "Revenue Reports", path: "/vendor/reports/revenue" },
        // {
        //   name: "Traffic & Conversion",
        //   path: "/vendor/reports/traffic-conversion",
        // },
      ],
    },
    {
      name: "Shipping Management",
      path: "/vendor/shipping",
      icon: FaShippingFast,
      role: "vendor",
      children: [
        { name: "Shipping Partners", path: "/vendor/shipping/methods" },
        { name: "Shipping Zones", path: "/vendor/shipping/zones" },
        // { name: "Carriers Integration", path: "/vendor/shipping/carriers" },
        // { name: "Tracking Updates", path: "/vendor/shipping/tracking" },
        // { name: "Shipping Rates", path: "/vendor/shipping/rates" },
      ],
    },
  ],
  admin: [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LuLayoutDashboard,
      role: "admin",
      children: [
        { name: "Overview", path: "/admin/dashboard/overview" },
        { name: "Sales Analytics", path: "/admin/dashboard/sales-analytics" },
      ],
    },
    {
      name: "Product Management",
      path: "/admin/products",
      icon: MdInventory2,
      role: "admin",
      children: [
        { name: "All Products", path: "/admin/products/all-products" },
        { name: "Category", path: "/admin/products/category" },
        { name: "Subcategory", path: "/admin/products/sub-category" },
        { name: "Child Category", path: "/admin/products/child-category" },
        { name: "Attributes", path: "/admin/products/attributes" },
        { name: "Attribute Value", path: "/admin/products/attribute-value" },
        { name: "Brand", path: "/admin/products/brand" },
        { name: "Reviews", path: "/admin/products/reviews" },
        { name: "Bulk Upload", path: "/admin/products/bulk-upload" },
      ],
    },
    {
      name: "Order Management",
      path: "/admin/orders",
      icon: FaCartArrowDown,
      role: "admin",
      children: [
        { name: "Order List", path: "/admin/orders/order-list" },
        { name: "Order Tracking", path: "/admin/orders/order-tracking" },
        { name: "Order History", path: "/admin/orders/order-history" },
        { name: "Refund Requests", path: "/admin/orders/refund-requests" },
        { name: "Return Management", path: "/admin/orders/return-management" },
      ],
    },
    {
      name: "Partner Management",
      path: "/admin/vendors",
      icon: FaUserTag,
      role: "admin",
      children: [
        { name: "Active All Partners", path: "/admin/vendors/all-vendors" },
        // { name: "Partner Details", path: "/admin/vendors/vendor-details/:id" },
        {
          name: "Partner Onboarding Requests",
          path: "/admin/vendors/onboarding-requests",
        },
        {
          name: "Rejected Partner Request",
          path: "/admin/vendors/rejected-requests",
        },
        { name: "Partner Payments", path: "/admin/vendors/payments" },
        {
          name: "Partner Reviews & Ratings",
          path: "/admin/vendors/reviews-ratings",
        },
      ],
    },
    {
      name: " User Management",
      path: "/admin/users",
      icon: FaUsersCog,
      role: "admin",
      children: [
        { name: "All Customers", path: "/admin/users/customers" },
        // { name: "Customer Details", path: "/admin/users/customer-details/:id" },
        // { name: "Customer Reviews", path: "/admin/users/customer-reviews" },
        // {
        //   name: "Manage Roles & Permissions",
        //   path: "/admin/users/manage-roles",
        // },
      ],
    },

    {
      name: "Payment Management",
      path: "/admin/payments",
      icon: PiMoneyBold,
      role: "admin",
      children: [
        { name: "Payment Gateways", path: "/admin/payments/gateways" },
        { name: "Invoices", path: "/admin/payments/invoices" },
        {
          name: "Transaction",
          path: "/admin/payments/transactions",
        },
        // { name: "Payouts", path: "/admin/payments/payouts" },
        // { name: "Refunds", path: "/admin/payments/refunds" },
        // { name: "Commissions Settings", path: "/admin/payments/commissions" },
      ],
    },
    {
      name: "Reports & Analytics",
      path: "/admin/reports",
      icon: TbReportSearch,
      role: "admin",
      children: [
        { name: "Sales Reports", path: "/admin/reports/sales" },
        { name: "Inventory Reports", path: "/admin/reports/inventory" },
        {
          name: "Product Performance",
          path: "/admin/reports/product-performance",
        },
        {
          name: "Partner Performance",
          path: "/admin/reports/vendor-performance",
        },
        { name: "Customer Reports", path: "/admin/reports/customers" },
        { name: "Revenue Reports", path: "/admin/reports/revenue" },
        // {
        //   name: "Traffic & Conversion",
        //   path: "/admin/reports/traffic-conversion",
        // },
      ],
    },
    {
      name: "Shipping Management",
      path: "/admin/shipping",
      icon: FaShippingFast,
      role: "admin",
      children: [
        { name: "Shipping Partners", path: "/admin/shipping/methods" },
        { name: "Shipping Zones", path: "/admin/shipping/zones" },
        // { name: "Carriers Integration", path: "/admin/shipping/carriers" },
        // { name: "Tracking Updates", path: "/admin/shipping/tracking" },
        // { name: "Shipping Rates", path: "/admin/shipping/rates" },
      ],
    },
    {
      name: "Coupons & Offers Management",
      path: "/admin/coupons",
      icon: RiCoupon3Fill,
      role: "admin",
      children: [
        { name: "All Coupons", path: "/admin/coupons/all-coupons" },
        { name: "Create Coupon", path: "/admin/coupons/create" },
        { name: "Ongoing Offers", path: "/admin/coupons/ongoing-offers" },
        { name: "Expired Offers", path: "/admin/coupons/expired-offers" },
        { name: "Coupon Usage Reports", path: "/admin/coupons/usage-reports" },
        {
          name: "Discount Campaigns",
          path: "/admin/coupons/discount-campaigns",
        },
        { name: "Flash Sales", path: "/admin/coupons/flash-sales" },
      ],
    },

    {
      name: "Communication Center",
      path: "/admin/communication",
      icon: IoChatbox,
      role: "admin",
      children: [
        {
          name: "Support Tickets",
          path: "/admin/communication/support-tickets",
        },
        { name: "Live Chat", path: "/admin/communication/live-chat" },
        {
          name: "Contact Messages",
          path: "/admin/communication/contact-messages",
        },
        { name: "Announcements", path: "/admin/communication/announcements" },
        {
          name: "Email Templates",
          path: "/admin/communication/email-templates",
        },
        {
          name: "Push Notifications",
          path: "/admin/communication/push-notifications",
        },
      ],
    },
    {
      name: "Content Management",
      path: "/admin/content",
      icon: BiBookContent,
      role: "admin",
      children: [
        { name: "Slider", path: "/admin/content/slider" },
        { name: "Banner", path: "/admin/content/banner" },
        { name: "Home Page", path: "/admin/content/homepage" },
        { name: "About Us", path: "/admin/content/about-us" },
        { name: "Contact Page", path: "/admin/content/contact-page" },
        { name: "Blog Management", path: "/admin/content/blog" },
        { name: "FAQ Management", path: "/admin/content/faq" },
      ],
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: IoIosSettings,
      role: "admin",
      children: [
        { name: "General Settings", path: "/admin/settings/general" },
        { name: "Payment Settings", path: "/admin/settings/payments" },
        { name: "Shipping Settings", path: "/admin/settings/shipping" },
        { name: "Currency & Tax", path: "/admin/settings/currency-tax" },
        { name: "SEO Settings", path: "/admin/settings/seo" },
      ],
    },
    {
      name: "System & Security",
      path: "/admin/system-security",
      icon: MdOutlineSecurity,
      role: "admin",
      children: [
        {
          name: "Backup & Restore",
          path: "/admin/system-security/backup-restore",
        },
        { name: "Activity Logs", path: "/admin/system-security/activity-logs" },
        {
          name: "Security Settings",
          path: "/admin/system-security/security-settings",
        },
        {
          name: "API Management",
          path: "/admin/system-security/api-management",
        },
        {
          name: "Maintenance Mode",
          path: "/admin/system-security/maintenance-mode",
        },
      ],
    },
  ]
};
