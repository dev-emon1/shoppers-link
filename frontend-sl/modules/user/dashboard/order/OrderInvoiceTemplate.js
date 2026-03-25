"use client";

import React from "react";

const OrderInvoiceTemplate = ({ order, billing, activeVendorOrders = [] }) => {
  const invoiceDate = new Date().toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
  const orderDate = new Date(order.created_at).toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });

  const calculatedShipping = activeVendorOrders.reduce(
    (t, v) => t + Number(v.shipping_charge || 0),
    0,
  );

  const calculatedSubtotal = activeVendorOrders.reduce(
    (t, v) => t + Number(v.subtotal || 0),
    0,
  );

  const grandTotal = calculatedSubtotal + calculatedShipping;

  const formatAddress = (b) => {
    if (!b) return "";
    return [
      b.fullName ? `<strong>${b.fullName}</strong>` : "",
      b.phone || "",
      [b.line1, b.area, `${b.city || ""} ${b.postal_code || ""}`.trim()]
        .filter(Boolean)
        .join(", "),
    ]
      .filter(Boolean)
      .join("\n");
  };

  const formatPrice = (amount) => `৳ ${Number(amount || 0).toFixed(2)}`;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "#92400e";
      case "delivered":
        return "#166534";
      case "cancelled":
        return "#991b1b";
      default:
        return "#0369a1";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "#166534";
      case "unpaid":
        return "#991b1b";
      case "pending":
        return "#92400e";
      default:
        return "#0369a1";
    }
  };

  return (
    <div
      id="invoice-template"
      style={{
        width: "800px",
        margin: "0 auto",
        padding: "40px 40px 36px",
        background: "#fff",
        fontFamily: "Inter, system-ui, Arial",
        color: "#111827",
        lineHeight: 1.5,
      }}
    >
      {/* Top Gradient Bar */}
      <div
        style={{
          height: "6px",
          background: "linear-gradient(to right, #4f46e5, #06b6d4)",
          marginBottom: "28px",
          borderRadius: "6px",
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "32px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "34px",
              fontWeight: "800",
              letterSpacing: "-0.6px",
            }}
          >
            INVOICE
          </div>
          <div
            style={{ marginTop: "8px", fontSize: "13.5px", color: "#374151" }}
          >
            <div>
              <strong>Invoice:</strong> INV-{order.unid}
            </div>
            <div>
              <strong>Order:</strong> ORD-{order.unid}
            </div>
          </div>
        </div>

        <img
          src="/images/logo.png"
          alt="shopzywork"
          style={{ width: "130px", height: "auto" }}
        />
      </div>

      {/* Address + Summary */}
      <div style={{ display: "flex", gap: "32px", marginBottom: "32px" }}>
        {/* Shipping / Billing Address */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: "13px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.6px",
              color: "#374151",
              marginBottom: "8px",
            }}
          >
            SHIPPING / BILLING ADDRESS
          </div>
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #f1f5f9",
              borderRadius: "10px",
              padding: "18px 20px",
              fontSize: "13.8px",
              lineHeight: "1.65",
              whiteSpace: "pre-line",
            }}
            dangerouslySetInnerHTML={{ __html: formatAddress(billing) }}
          />
        </div>

        {/* Order Summary */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: "13px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.6px",
              color: "#374151",
              marginBottom: "8px",
            }}
          >
            ORDER SUMMARY
          </div>
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #f1f5f9",
              borderRadius: "10px",
              padding: "16px 20px",
              fontSize: "13.8px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "7px 0",
              }}
            >
              <span style={{ color: "#64748b" }}>Order Date</span>
              <span>{orderDate}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "7px 0",
              }}
            >
              <span style={{ color: "#64748b" }}>Invoice Date</span>
              <span>{invoiceDate}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "7px 0",
              }}
            >
              <span style={{ color: "#64748b" }}>Order Status</span>
              <span
                style={{
                  fontWeight: "600",
                  color: getStatusColor(order.status),
                }}
              >
                {order.status}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "7px 0",
              }}
            >
              <span style={{ color: "#64748b" }}>Payment Status</span>
              <span
                style={{
                  fontWeight: "600",
                  color: getPaymentStatusColor(order.payment_status),
                }}
              >
                {order.payment_status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Sections - Tighter Spacing */}
      {activeVendorOrders.map((vo) => (
        <div
          key={vo.id}
          style={{
            marginBottom: "20px", // Reduced gap
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          {/* Vendor Shop Name - Much tighter */}
          <div
            style={{
              background: "#f8fafc",
              padding: "8px 24px",
              fontWeight: "700",
              fontSize: "15px",
              color: "#1e2937",
            }}
          >
            {vo.vendor?.shop_name}
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "12px 24px",
                    fontSize: "12.5px",
                    fontWeight: "700",
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    borderBottom: "2px solid #e2e8f0",
                  }}
                >
                  ITEM
                </th>
                <th
                  style={{
                    textAlign: "center",
                    padding: "12px 24px",
                    fontSize: "12.5px",
                    fontWeight: "700",
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    borderBottom: "2px solid #e2e8f0",
                    width: "80px",
                  }}
                >
                  QTY
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "12px 24px",
                    fontSize: "12.5px",
                    fontWeight: "700",
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    borderBottom: "2px solid #e2e8f0",
                    width: "140px",
                  }}
                >
                  PRICE
                </th>
              </tr>
            </thead>
            <tbody>
              {vo.items?.map((it) => (
                <tr key={it.unid}>
                  <td
                    style={{
                      padding: "12px 24px",
                      fontSize: "14px",
                      fontWeight: "500",
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    {it.product?.name}
                  </td>
                  <td
                    style={{
                      padding: "12px 24px",
                      textAlign: "center",
                      fontSize: "14px",
                      fontWeight: "500",
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    {it.quantity}
                  </td>
                  <td
                    style={{
                      padding: "12px 24px",
                      textAlign: "right",
                      fontSize: "14px",
                      fontWeight: "600",
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    {formatPrice(it.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Shipping & Subtotal - Tighter */}
          <div
            style={{
              padding: "12px 24px", // Reduced padding
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "3px",
              fontSize: "14.2px",
            }}
          >
            <div>Shipping: {formatPrice(vo.shipping_charge)}</div>
            <div style={{ fontWeight: "700", fontSize: "15px" }}>
              Subtotal: {formatPrice(vo.subtotal)}
            </div>
          </div>
        </div>
      ))}

      {/* Grand Total */}
      <div
        style={{
          marginLeft: "auto",
          width: "340px",
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "22px 24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "6px 0",
            fontSize: "14.5px",
          }}
        >
          <span style={{ color: "#64748b" }}>Subtotal</span>
          <span>{formatPrice(calculatedSubtotal)}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "6px 0",
            fontSize: "14.5px",
          }}
        >
          <span style={{ color: "#64748b" }}>Shipping</span>
          <span>{formatPrice(calculatedShipping)}</span>
        </div>

        <div
          style={{
            borderTop: "2px solid #111827",
            marginTop: "12px",
            paddingTop: "14px",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "17.5px",
            fontWeight: "800",
          }}
        >
          <span>Total</span>
          <span>{formatPrice(grandTotal)}</span>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "42px",
          textAlign: "center",
          fontSize: "13.5px",
          color: "#64748b",
        }}
      >
        Thank you for shopping with us 💙
      </div>
    </div>
  );
};

export default OrderInvoiceTemplate;
