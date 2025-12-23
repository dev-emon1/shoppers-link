import { createElement, lazy } from "react";
import ProtectedRoute from "../ProtectedRoute";
const Overview = lazy(() => import("../../views/admin/index/Overview"));
const SalesAnalytics = lazy(() =>
  import("../../views/admin/index/SalesAnalytics")
);
const AllProducts = lazy(() =>
  import("../../views/admin/product-management/AllProducts")
);
const Category = lazy(() =>
  import("../../views/admin/product-management/Category")
);
const Subcategory = lazy(() =>
  import("../../views/admin/product-management/Subcategory")
);
const ChildCategory = lazy(() =>
  import("../../views/admin/product-management/ChildCategory")
);
const Attributes = lazy(() =>
  import("../../views/admin/product-management/Attributes")
);
const AttributeValue = lazy(() =>
  import("../../views/admin/product-management/AttributeValue")
);
const Customers = lazy(() =>
  import("../../views/admin/user-management/Customers")
);
const CustomerDetail = lazy(() =>
  import("../../views/admin/user-management/CustomerDetails")
);
const OrderList = lazy(() =>
  import("../../views/admin/order-management/OrderList")
);
const RefundRequest = lazy(() =>
  import("../../views/admin/order-management/RefundRequest")
);
const ReturnManagement = lazy(() =>
  import("../../views/admin/order-management/ReturnManagement")
);
const OrderTracking = lazy(() =>
  import("../../views/admin/order-management/OrderTracking")
);
const AllVendors = lazy(() =>
  import("../../views/admin/vendor-management/AllVendors")
);
const OnboardingVendor = lazy(() =>
  import("../../views/admin/vendor-management/OnboardingVendor")
);
const RejectVendor = lazy(() =>
  import("../../views/admin/vendor-management/RejectVendor")
);
const PaymentGetway = lazy(() =>
  import("../../views/admin/payment-management/PaymentGetway")
);
const Invoices = lazy(() =>
  import("../../views/admin/payment-management/Invoices")
);
const ShippingMethod = lazy(() =>
  import("../../views/admin/shipping-management/ShippingMethod")
);
const SalesReport = lazy(() =>
  import("../../views/admin/report-management/SalesReport")
);
const ProductPerform = lazy(() =>
  import("../../views/admin/report-management/ProductPerform")
);
const VendorPerform = lazy(() =>
  import("../../views/admin/report-management/VendorPerform")
);
const CustomerReport = lazy(() =>
  import("../../views/admin/report-management/CustomerReport")
);
const AllInventory = lazy(() =>
  import("../../views/admin/inventory-management/AllInventory")
);
const RevenueReport = lazy(() =>
  import("../../views/admin/report-management/RevenueReport")
);
const ShippingZone = lazy(() =>
  import("../../views/admin/shipping-management/ShippingZone")
);
const Transaction = lazy(() =>
  import("../../views/admin/payment-management/Transaction")
);
const Slider = lazy(() =>
  import("../../views/admin/promotion-management/Slider")
);
const Banner = lazy(() =>
  import("../../views/admin/promotion-management/Banner")
);
const Brand = lazy(() => import("../../views/admin/product-management/Brand"));
const Profile = lazy(() => import("../../views/auth/Profile"));
const protectAdmin = (component) => createElement(ProtectedRoute, { element: createElement(component), allowedRole: "admin" });

export const adminRoutes = [
  { path: "/admin/pomotion/slider", element: protectAdmin(Slider) },
  { path: "/admin/pomotion/banner", element: protectAdmin(Banner) },
  { path: "/admin/users/customers/:id", element: protectAdmin(CustomerDetail) },
  { path: "/admin/dashboard", element: protectAdmin(Overview) },
  { path: "/admin/dashboard/overview", element: protectAdmin(Overview) },
  { path: "/admin/dashboard/sales-analytics", element: protectAdmin(SalesAnalytics) },
  { path: "/admin/products/all-products", element: protectAdmin(AllProducts) },
  { path: "/admin/products/category", element: protectAdmin(Category) },
  { path: "/admin/products/sub-category", element: protectAdmin(Subcategory) },
  { path: "/admin/products/child-category", element: protectAdmin(ChildCategory) },
  { path: "/admin/products/attributes", element: protectAdmin(Attributes) },
  { path: "/admin/products/attribute-value", element: protectAdmin(AttributeValue) },
  { path: "/admin/products/brand", element: protectAdmin(Brand) },
  { path: "/admin/users/customers", element: protectAdmin(Customers) },
  { path: "/admin/orders/order-list", element: protectAdmin(OrderList) },
  { path: "/admin/orders/refund-requests", element: protectAdmin(RefundRequest) },
  { path: "/admin/orders/return-management", element: protectAdmin(ReturnManagement) },
  { path: "/admin/orders/order-tracking", element: protectAdmin(OrderTracking) },
  { path: "/admin/vendors/all-vendors", element: protectAdmin(AllVendors) },
  { path: "/admin/vendors/onboarding-requests", element: protectAdmin(OnboardingVendor) },
  { path: "/admin/vendors/rejected-requests", element: protectAdmin(RejectVendor) },
  { path: "/admin/payments/transactions", element: protectAdmin(Transaction) },
  { path: "/admin/payments/invoices", element: protectAdmin(Invoices) },
  { path: "/admin/payments/gateways", element: protectAdmin(PaymentGetway) },
  { path: "/admin/shipping/methods", element: protectAdmin(ShippingMethod) },
  { path: "/admin/shipping/zones", element: protectAdmin(ShippingZone) },
  { path: "/admin/reports/sales", element: protectAdmin(SalesReport) },
  { path: "/admin/reports/product-performance", element: protectAdmin(ProductPerform) },
  { path: "/admin/reports/vendor-performance", element: protectAdmin(VendorPerform) },
  { path: "/admin/reports/customers", element: protectAdmin(CustomerReport) },
  { path: "/admin/reports/revenue", element: protectAdmin(RevenueReport) },
  { path: "/admin/profile", element: protectAdmin(Profile) },
];

