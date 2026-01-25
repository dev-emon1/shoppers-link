import { createRoot } from "react-dom/client";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import OrderInvoiceTemplate from "@/modules/user/dashboard/order/OrderInvoiceTemplate";

/**
 * Centralized PDF Generator
 * -----------------------------------
 * - Used by User + Admin
 * - Optimized for size & quality
 * - Single source of truth
 */
export async function generateInvoicePdf({
  order,
  billing,
  activeVendorOrders,
  totals,
}) {
  // Offscreen render container
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-10000px";
  container.style.top = "0";
  container.style.background = "white";
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(
    <OrderInvoiceTemplate
      order={order}
      billing={billing}
      activeVendorOrders={activeVendorOrders}
      totals={totals}
    />,
  );

  // Wait for render
  await new Promise((r) => setTimeout(r, 300));

  const element = document.getElementById("invoice-template");

  const canvas = await html2canvas(element, {
    scale: 1.25,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.75);

  const pdf = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(
    imgData,
    "JPEG",
    0,
    position,
    imgWidth,
    imgHeight,
    undefined,
    "FAST",
  );
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position -= pageHeight;
    pdf.addPage();
    pdf.addImage(
      imgData,
      "JPEG",
      0,
      position,
      imgWidth,
      imgHeight,
      undefined,
      "FAST",
    );
    heightLeft -= pageHeight;
  }

  pdf.save(`invoice_${order.unid}.pdf`);

  // Cleanup
  root.unmount();
  document.body.removeChild(container);
}
