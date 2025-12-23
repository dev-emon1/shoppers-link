import { createElement, lazy } from "react";
import ProtectedRoute from "../ProtectedRoute";
const Overview = lazy(() => import("../../views/vendor/index/Overview"));
const SalesAnalytics = lazy(() =>
  import("../../views/vendor/index/SalesAnalytics")
);
const AllProducts = lazy(() =>
  import("../../views/vendor/product-management/AllProducts")
);
const AddProduct = lazy(() =>
  import("../../views/vendor/product-management/add-product")
);
const Customers = lazy(() =>
  import("../../views/vendor/user-management/Customers")
);
const CustomerDetail = lazy(() =>
  import("../../views/vendor/user-management/CustomerDetails")
);
const OrderList = lazy(() =>
  import("../../views/vendor/order-management/OrderList")
);
const RefundRequest = lazy(() =>
  import("../../views/vendor/order-management/RefundRequest")
);
const ReturnManagement = lazy(() =>
  import("../../views/vendor/order-management/ReturnManagement")
);
const OrderTracking = lazy(() =>
  import("../../views/vendor/order-management/OrderTracking")
);
const PaymentGetway = lazy(() =>
  import("../../views/vendor/payment-management/PaymentGetway")
);
const Invoices = lazy(() =>
  import("../../views/vendor/payment-management/Invoices")
);
const ShippingMethod = lazy(() =>
  import("../../views/vendor/shipping-management/ShippingMethod")
);
const SalesReport = lazy(() =>
  import("../../views/vendor/report-management/SalesReport")
);
const ProductPerform = lazy(() =>
  import("../../views/vendor/report-management/ProductPerform")
);
const InventoryReport = lazy(() =>
  import("../../views/vendor/report-management/InventoryReport")
);
const CustomerReport = lazy(() =>
  import("../../views/vendor/report-management/CustomerReport")
);
const AllInventory = lazy(() =>
  import("../../views/vendor/inventory-management/AllInventory")
);
const AddInventory = lazy(() =>
  import("../../views/vendor/inventory-management/AddInventory")
);
const RevenueReport = lazy(() =>
  import("../../views/vendor/report-management/RevenueReport")
);
const ShippingZone = lazy(() =>
  import("../../views/vendor/shipping-management/ShippingZone")
);
const Transaction = lazy(() =>
  import("../../views/vendor/payment-management/Transaction")
);
const FreatureProduct = lazy(() =>
  import("../../views/vendor/product-management/FreatureProduct")
);
const AddFeatureProduct = lazy(() =>
  import("../../views/vendor/product-management/AddFeatureProduct")
);
const Brand = lazy(() => import("../../views/vendor/product-management/Brand"));
const Profile = lazy(() => import("../../views/auth/Profile"));
const protect = (component, role) =>
  createElement(ProtectedRoute, { element: createElement(component), allowedRole: role });

export const vendorRoutes = [
  { path: "/vendor/users/customers/:id", element: protect(CustomerDetail, "vendor") },
  { path: "/vendor/products/add-feature-product", element: protect(AddFeatureProduct, "vendor") },
  { path: "/vendor/products/feature-product", element: protect(FreatureProduct, "vendor") },
  { path: "/vendor/dashboard", element: protect(Overview, "vendor") },
  { path: "/vendor/dashboard/overview", element: protect(Overview, "vendor") },
  { path: "/vendor/dashboard/sales-analytics", element: protect(SalesAnalytics, "vendor") },
  { path: "/vendor/products/all-products", element: protect(AllProducts, "vendor") },
  { path: "/vendor/products/add-product", element: protect(AddProduct, "vendor") },
  { path: "/vendor/products/brand", element: protect(Brand, "vendor") },
  { path: "/vendor/users/customers", element: protect(Customers, "vendor") },
  { path: "/vendor/orders/order-list", element: protect(OrderList, "vendor") },
  { path: "/vendor/orders/refund-requests", element: protect(RefundRequest, "vendor") },
  { path: "/vendor/orders/return-management", element: protect(ReturnManagement, "vendor") },
  { path: "/vendor/orders/order-tracking", element: protect(OrderTracking, "vendor") },
  { path: "/vendor/payments/transactions", element: protect(Transaction, "vendor") },
  { path: "/vendor/payments/invoices", element: protect(Invoices, "vendor") },
  { path: "/vendor/payments/gateways", element: protect(PaymentGetway, "vendor") },
  { path: "/vendor/shipping/methods", element: protect(ShippingMethod, "vendor") },
  { path: "/vendor/shipping/zones", element: protect(ShippingZone, "vendor") },
  { path: "/vendor/inventory/inventory-list", element: protect(AllInventory, "vendor") },
  { path: "/vendor/inventory/inventory-create", element: protect(AddInventory, "vendor") },
  { path: "/vendor/reports/sales", element: protect(SalesReport, "vendor") },
  { path: "/vendor/reports/product-performance", element: protect(ProductPerform, "vendor") },
  { path: "/vendor/reports/customers", element: protect(CustomerReport, "vendor") },
  { path: "/vendor/reports/inventory", element: protect(InventoryReport, "vendor") },
  { path: "/vendor/reports/revenue", element: protect(RevenueReport, "vendor") },
  { path: "/vendor/profile", element: protect(Profile, "vendor") },
];
