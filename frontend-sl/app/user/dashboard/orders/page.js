// app/user/dashboard/orders/page.js
"use client";
import React from "react";
import OrdersPageComponent from "@/modules/user/dashboard/order/OrdersPageComponent";

export default function OrdersPage() {
  return (
    <main className=" bg-bgPage min-h-[80vh]">
      <OrdersPageComponent />
    </main>
  );
}
