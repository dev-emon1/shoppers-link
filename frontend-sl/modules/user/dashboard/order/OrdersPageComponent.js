// modules/user/components/dashboard/order/OrdersPageComponent.jsx
"use client";
import React, { useEffect } from "react";
import useOrders from "@/modules/user/hooks/useOrders";
import OrdersToolbar from "./OrdersToolbar";
import OrderCard from "./OrderCard";
import Link from "next/link";

export default function OrdersPageComponent() {
  const { list, loading, error, fetchOrders, meta } = useOrders();

  useEffect(() => {
    fetchOrders({ page: 1, per_page: 10 }).catch(() => { });
  }, [fetchOrders]);

  return (
    <div>
      <div className="mb-4">
        <OrdersToolbar
          onSearch={(q) =>
            fetchOrders({
              page: 1,
              per_page: 10,
              force: true,
              extraParams: { search: q },
            })
          }
          onFilter={(status) =>
            fetchOrders({
              page: 1,
              per_page: 10,
              force: true,
              extraParams: { status },
            })
          }
          onRefresh={() => fetchOrders({ page: 1, per_page: 10, force: true })}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading && (
          <div className="col-span-full text-center py-8">
            Loading orders...
          </div>
        )}
        {!loading && (!list || list.length === 0) && (
          <div className="col-span-full text-center p-8 bg-bgSurface rounded-lg border">
            No orders found
          </div>
        )}
        {list &&
          list.map((o) => (
            <div key={o.unid ?? o.id}>
              <OrderCard order={o} />
            </div>
          ))}
      </div>

      {/* Simple pagination */}
      {meta &&
        (meta.current_page ?? meta.currentPage) <
        (meta.last_page ?? meta.lastPage) && (
          <div className="mt-6 flex justify-center">
            <button
              className="px-4 py-2 border rounded-md"
              onClick={() =>
                fetchOrders({
                  page: (meta.current_page ?? meta.currentPage) + 1,
                  per_page: 10,
                })
              }
            >
              Load more
            </button>
          </div>
        )}
    </div>
  );
}
