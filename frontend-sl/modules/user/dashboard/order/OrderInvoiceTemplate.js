// components/OrderInvoiceTemplate.jsx
import React from "react";
const OrderInvoiceTemplate = ({
  order,
  billing,
  activeVendorOrders,
  totals,
}) => {
  return (
    <div
      id="invoice-template"
      style={{
        width: "800px",
        padding: "40px",
        backgroundColor: "white",
        color: "black",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "2px solid #eee",
          paddingBottom: "20px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "28px", margin: 0 }}>INVOICE</h1>
          <p style={{ color: "#666" }}>Order ID: {order.unid}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <img
            src="/images/logo.png"
            alt="Shop Logo"
            style={{ width: "100px", height: "60px" }}
          />
          {/* <h2 style={{ fontSize: '20px', margin: 0 }}>Your Shop Name</h2> */}
          {/* <p style={{ fontSize: '12px' }}>{new Date().toLocaleDateString()}</p> */}
        </div>
      </div>

      {/* Addresses */}
      <div style={{ display: "flex", marginTop: "30px", gap: "40px" }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ borderBottom: "1px solid #eee", paddingBottom: "5px" }}>
            Billing To:
          </h4>
          <p style={{ fontSize: "14px", lineHeight: "1.6" }}>
            <strong>{billing?.fullName || billing?.name}</strong>
            <br />
            {billing?.phone}
            <br />
            {billing?.line1}
            <br />
            {billing?.city}, {billing?.area}
          </p>
        </div>
        <div style={{ flex: 1, textAlign: "right" }}>
          <h4 style={{ borderBottom: "1px solid #eee", paddingBottom: "5px" }}>
            Order Summary:
          </h4>
          <p style={{ fontSize: "14px" }}>
            Date: {new Date(order.created_at).toLocaleDateString()}
            <br />
            Status: {order.status}
            <br />
            Payment Method: {order.payment_method}
            <br />
            Payment Status: {order.payment_status}
            <br />
            <strong>Total: ৳ {order.total_amount}</strong>
          </p>
        </div>
      </div>

      {/* Items Table */}
      <table
        style={{ width: "100%", marginTop: "30px", borderCollapse: "collapse" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f9f9f9", textAlign: "left" }}>
            <th style={{ padding: "10px", border: "1px solid #eee" }}>
              Item (পণ্য)
            </th>
            <th style={{ padding: "10px", border: "1px solid #eee" }}>
              Vendor (বিক্রেতা)
            </th>
            <th style={{ padding: "10px", border: "1px solid #eee" }}>Qty</th>
            <th style={{ padding: "10px", border: "1px solid #eee" }}>Price</th>
          </tr>
        </thead>
        <tbody>
          {activeVendorOrders.map((v) =>
            v.items?.map((it, idx) => (
              <tr key={`${v.id}-${idx}`}>
                <td style={{ padding: "10px", border: "1px solid #eee" }}>
                  {it.product?.name}
                </td>
                <td style={{ padding: "10px", border: "1px solid #eee" }}>
                  {v.vendor?.shop_name}
                </td>
                <td style={{ padding: "10px", border: "1px solid #eee" }}>
                  {it.quantity}
                </td>
                <td style={{ padding: "10px", border: "1px solid #eee" }}>
                  ৳ {it.total}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Totals */}
      <div
        style={{
          marginTop: "30px",
          textAlign: "right",
          width: "300px",
          marginLeft: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "5px 0",
          }}
        >
          <span>Subtotal:</span> <span>৳ {totals?.subtotal}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "5px 0",
          }}
        >
          <span>Shipping:</span> <span>৳ {totals?.shipping}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 0",
            borderTop: "2px solid #000",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          <span>Grand Total:</span> <span>৳ {totals?.grandTotal}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderInvoiceTemplate;
