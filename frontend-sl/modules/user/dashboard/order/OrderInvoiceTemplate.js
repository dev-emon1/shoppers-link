// modules/user/dashboard/order/OrderInvoiceTemplate.jsx
import React from "react";

const OrderInvoiceTemplate = ({
  order,
  billing,
  activeVendorOrders = [],
  totals,
}) => {
  const safeTotals = totals ?? {}; // 🔒 FIX 1

  const invoiceDate = new Date().toLocaleDateString();
  const orderDate = new Date(order.created_at).toLocaleDateString();

  return (
    <div
      id="invoice-template"
      style={{
        width: "800px",
        padding: "40px",
        backgroundColor: "#ffffff",
        color: "#000",
        fontFamily: "Arial, sans-serif",
        fontSize: "13px",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "2px solid #eee",
          paddingBottom: "16px",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "26px", margin: 0 }}>INVOICE</h1>
          <p style={{ margin: "6px 0", color: "#555" }}>
            Invoice No: INV-{order.unid}
            <br />
            Order ID: {order.unid}
          </p>
        </div>

        <div style={{ textAlign: "right" }}>
          <img
            src="/images/logo.png"
            alt="ShoppersLink"
            style={{ width: "110px" }}
          />
        </div>
      </div>

      {/* ADDRESS & SUMMARY */}
      <div style={{ display: "flex", gap: "40px", marginBottom: "30px" }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ borderBottom: "1px solid #eee", paddingBottom: "6px" }}>
            Billing To
          </h4>
          <p style={{ lineHeight: "1.6" }}>
            <strong>{billing?.fullName || billing?.name || "—"}</strong>
            <br />
            {billing?.phone || "—"}
            <br />
            {billing?.line1 || "—"}
            <br />
            {[billing?.city, billing?.area, billing?.postalCode]
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>

        <div style={{ flex: 1, textAlign: "right" }}>
          <h4 style={{ borderBottom: "1px solid #eee", paddingBottom: "6px" }}>
            Order Summary
          </h4>
          <p style={{ lineHeight: "1.6" }}>
            Order Date: {orderDate}
            <br />
            Invoice Date: {invoiceDate}
            <br />
            Status: {order.status}
            <br />
            Payment Method: {order.payment_method}
            <br />
            Payment Status: {order.payment_status}
          </p>
        </div>
      </div>

      {/* MULTIVENDOR ITEMS */}
      {activeVendorOrders.map((vendorOrder) => {
        const vendorName = vendorOrder.vendor?.shop_name || "Unknown Vendor";

        return (
          <div key={vendorOrder.id} style={{ marginBottom: "28px" }}>
            <div
              style={{
                backgroundColor: "#f5f7fa",
                padding: "8px 12px",
                fontWeight: "bold",
                border: "1px solid #eee",
              }}
            >
              Vendor: {vendorName}
            </div>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#fafafa" }}>
                  <th style={thStyle}>Item</th>
                  <th style={thStyle}>Qty</th>
                  <th style={thStyle}>Price</th>
                </tr>
              </thead>
              <tbody>
                {vendorOrder.items?.map((it) => {
                  let attributes = {};
                  try {
                    attributes =
                      typeof it.variant?.attributes === "string"
                        ? JSON.parse(it.variant.attributes)
                        : {};
                  } catch {}

                  return (
                    <tr key={it.unid}>
                      <td style={tdStyle}>
                        <strong>{it.product?.name}</strong>
                        {Object.keys(attributes).length > 0 && (
                          <div style={{ fontSize: "11px", marginTop: "4px" }}>
                            {Object.entries(attributes).map(([k, v]) => (
                              <span key={k} style={{ marginRight: "8px" }}>
                                <strong>{k}:</strong> {v}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td style={tdStyle}>{it.quantity}</td>
                      <td style={tdStyle}>৳ {it.total}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div
              style={{
                textAlign: "right",
                marginTop: "8px",
                fontWeight: "bold",
              }}
            >
              Vendor Subtotal: ৳ {vendorOrder.subtotal ?? 0}
            </div>
          </div>
        );
      })}

      {/* TOTALS */}
      <div style={{ marginTop: "30px", marginLeft: "auto", width: "320px" }}>
        <div style={totalRow}>
          <span>Subtotal:</span>
          <span>৳ {safeTotals.subtotal ?? order.total_amount}</span>
        </div>
        <div style={totalRow}>
          <span>Shipping:</span>
          <span>৳ {safeTotals.shipping_charge ?? 0}</span>
        </div>
        <div
          style={{
            ...totalRow,
            borderTop: "2px solid #000",
            fontWeight: "bold",
          }}
        >
          <span>Grand Total:</span>
          <span>৳ {safeTotals.grandTotal ?? order.total_amount}</span>
        </div>
      </div>

      {/* FOOTER */}
      <div
        style={{
          marginTop: "40px",
          paddingTop: "16px",
          borderTop: "1px solid #eee",
          fontSize: "11px",
          color: "#555",
        }}
      >
        <p>This is a system-generated invoice.</p>
        <p>
          For support contact: info@fingertipsinnovations.com <br />
          Return & refund policy applies.
        </p>
      </div>
    </div>
  );
};

const thStyle = {
  padding: "10px",
  border: "1px solid #eee",
  textAlign: "left",
};

const tdStyle = {
  padding: "10px",
  border: "1px solid #eee",
};

const totalRow = {
  display: "flex",
  justifyContent: "space-between",
  padding: "6px 0",
};

export default OrderInvoiceTemplate;
