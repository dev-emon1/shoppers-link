import { FaUser, FaUsers, FaShoppingCart, FaTimesCircle, FaBan } from "react-icons/fa";
import { HiMiniReceiptRefund } from "react-icons/hi2";
import {
  MdSell,
  MdOutlineArrowDropDown,
  MdOutlineArrowDropUp,
  MdWarning,
} from "react-icons/md";

export const statusCardsData = [
  {
    id: 1,
    icon: FaUser,
    title: "Total Vendors",
    count: "216",
    percentage: "3.5%",
    isIncrease: true,
    time: "Last Week",
    roles: ["admin"], // only admin sees it
    url: "/admin/vendors/all-vendors",
  },
  {
    id: 2,
    icon: FaUsers,
    title: "Total Customers",
    count: "21,216",
    percentage: "4.5%",
    isIncrease: false,
    time: "Last Week",
    roles: ["admin",], // both can see
    url: "/admin//users/customers",
  },
  {
    id: 3,
    icon: FaShoppingCart,
    title: "Total Orders",
    count: "15,236",
    percentage: "5.5%",
    isIncrease: true,
    time: "Last Week",
    roles: ["admin", "vendor"],
    // Logic: if admin is in the roles list, use admin URL, else vendor URL
    url: ["admin", "vendor"].includes("admin")
      ? "/admin/orders/order-list"
      : "/vendor/orders/order-list",
  },
  {
    id: 4,
    icon: MdSell,
    title: "Total Sales",
    count: "৳21,45,600",
    percentage: "4.5%",
    isIncrease: true,
    time: "Last Week",
    roles: ["vendor", "admin"], // vendor only
    // Logic: if admin is in the roles list, use admin URL, else vendor URL
    url: ["admin", "vendor"].includes("admin")
      ? "/admin/orders/order-list"
      : "/vendor/orders/order-list",
  },
  {
    id: 5,
    icon: FaShoppingCart,
    title: "Pending Orders",
    count: "12",
    percentage: "2.5%",
    isIncrease: true,
    time: "Last Week",
    roles: ["admin", "vendor"],
    // Logic: if admin is in the roles list, use admin URL, else vendor URL
    url: ["admin", "vendor"].includes("admin")
      ? "/admin/orders/order-list"
      : "/vendor/orders/order-list",
  },
  {
    id: 5,
    icon: FaBan,
    title: "Cancel Orders",
    count: "12",
    percentage: "2.5%",
    isIncrease: true,
    time: "Last Week",
    roles: ["admin", "vendor"],
    // Logic: if admin is in the roles list, use admin URL, else vendor URL
    url: ["admin", "vendor"].includes("admin")
      ? "/admin/orders/order-list"
      : "/vendor/orders/order-list",
  },
  {
    id: 6,
    icon: HiMiniReceiptRefund,
    title: "Refund Request",
    count: "12",
    percentage: "1.5%",
    isIncrease: false,
    time: "Last Week",
    roles: ["admin", "vendor"],
    url: "/vendor/orders/order-list",
  },
  {
    id: 7,
    icon: MdWarning,
    title: "Low Inventory",
    count: "0",
    percentage: "0%",
    isIncrease: false, // Usually false as this is a warning
    time: "Real-time",
    roles: ["admin", "vendor"],
    url: "/vendor/inventory/inventory-create",
  }
];


export const activities = [
  {
    id: 1,
    title: "Your account was logged in",
    time: "10 minutes ago",
    user: "Abir Hasan",
    avatar: "https://i.pravatar.cc/40?img=11",
  },
  {
    id: 2,
    title: "Language changed to Bangla",
    time: "30 minutes ago",
    user: "Mahima Tasnim",
    avatar: "https://i.pravatar.cc/40?img=12",
  },
  {
    id: 3,
    title: "Asked a question about this project",
    time: "1 hour ago",
    user: "Rashedul Karim",
    avatar: "https://i.pravatar.cc/40?img=13",
  },
];
