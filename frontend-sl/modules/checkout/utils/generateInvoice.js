import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoice = (order) => {
  if (!order) {
    console.warn("⚠️ No order data provided for invoice generation.");
    return;
  }

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // 🧾 Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("INVOICE", pageWidth / 2, 20, { align: "center" });

  // 🆔 Order Info
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Order ID: ${order.id}`, 14, 30);
  doc.text(`Date: ${order.date}`, 14, 36);
  doc.text(`Status: ${order.status || "Pending"}`, 14, 42);

  // 🏢 Seller Info
  doc.text("Seller: ShoppersLink", pageWidth - 14, 30, { align: "right" });
  doc.text("support@shopperslink.com", pageWidth - 14, 36, { align: "right" });
  doc.text("Dhaka, Bangladesh", pageWidth - 14, 42, { align: "right" });

  // 🧍 Customer Info
  doc.setFont("helvetica", "bold");
  doc.text("Billing Address:", 14, 55);
  doc.setFont("helvetica", "normal");
  doc.text(`${order.customer?.name || "N/A"}`, 14, 61);
  doc.text(`${order.customer?.phone || ""}`, 14, 67);
  doc.text(`${order.customer?.address || ""}`, 14, 73);

  // 🛍️ Table of items
  const tableData = (order.items || []).map((item) => [
    item.name,
    item.quantity,
    `৳${item.price.toLocaleString("en-BD")}`,
    `৳${(item.price * item.quantity).toLocaleString("en-BD")}`,
  ]);

  autoTable(doc, {
    startY: 85,
    head: [["Item", "Qty", "Price", "Total"]],
    body: tableData,
    theme: "grid",
    styles: {
      fontSize: 10,
      halign: "right",
    },
    headStyles: {
      fillColor: [245, 245, 245],
      textColor: [40, 40, 40],
      halign: "center",
      fontStyle: "bold",
    },
    bodyStyles: {
      textColor: [50, 50, 50],
    },
    columnStyles: {
      0: { halign: "left" },
      1: { halign: "center", cellWidth: 20 },
      2: { halign: "right", cellWidth: 30 },
      3: { halign: "right", cellWidth: 35 },
    },
  });

  let finalY = doc.lastAutoTable.finalY + 10;

  // 💰 Totals Section
  const lineHeight = 6;
  const totals = [
    ["Subtotal:", order.subtotal],
    ["Shipping:", order.shipping],
    ["VAT (5%):", order.vat || order.subtotal * 0.05],
  ];

  if (order.discount && order.discount > 0) {
    totals.push(["Discount:", -order.discount]);
  }

  totals.push(["Grand Total:", order.total]);

  totals.forEach(([label, value], index) => {
    const y = finalY + index * lineHeight;
    doc.setFont("helvetica", label.includes("Grand") ? "bold" : "normal");
    doc.text(label, pageWidth - 80, y);
    doc.text(
      `${value >= 0 ? "৳" : "-৳"}${Math.abs(value).toLocaleString("en-BD", {
        minimumFractionDigits: 2,
      })}`,
      pageWidth - 30,
      y,
      { align: "right" }
    );
  });

  finalY += (totals.length + 1) * lineHeight;

  // 💳 Payment Method
  doc.setFont("helvetica", "bold");
  doc.text("Payment Method:", 14, finalY + 10);
  doc.setFont("helvetica", "normal");
  doc.text(order.paymentMethod || "N/A", 60, finalY + 10);

  // 🧾 Footer
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(
    "Thank you for shopping with ShoppersLink!",
    pageWidth / 2,
    finalY + 25,
    { align: "center" }
  );
  doc.text("Visit: https://shopperslink.com", pageWidth / 2, finalY + 31, {
    align: "center",
  });

  // 💾 Save file
  const fileName = `${order.id || "invoice"}.pdf`;
  doc.save(fileName);
};
