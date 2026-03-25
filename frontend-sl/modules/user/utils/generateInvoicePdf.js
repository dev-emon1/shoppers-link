import { createRoot } from "react-dom/client";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import OrderInvoiceTemplate from "@/modules/user/dashboard/order/OrderInvoiceTemplate";

export async function generateInvoicePdf({
  order,
  billing,
  activeVendorOrders,
  totals,
}) {
  // 🔹 Create offscreen container
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-10000px";
  container.style.top = "0";
  container.style.background = "#fff";
  container.style.width = "820px"; // A4 safe width
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

  // ⏳ Wait for render
  await new Promise((r) => setTimeout(r, 400));

  const element = document.getElementById("invoice-template");

  // 🔥 HIGH QUALITY CANVAS
  const canvas = await html2canvas(element, {
    scale: 2, // 🔥 HIGH QUALITY
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.95); // 🔥 HIGH QUALITY

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;

  const margin = 10;

  const imgWidth = pageWidth - margin * 2;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = margin;

  // 🔹 First page
  pdf.addImage(
    imgData,
    "JPEG",
    margin,
    position,
    imgWidth,
    imgHeight,
    undefined,
    "FAST",
  );

  heightLeft -= pageHeight;

  // 🔹 Multi page support
  while (heightLeft > 0) {
    position = heightLeft - imgHeight + margin;
    pdf.addPage();

    pdf.addImage(
      imgData,
      "JPEG",
      margin,
      position,
      imgWidth,
      imgHeight,
      undefined,
      "FAST",
    );

    heightLeft -= pageHeight;
  }

  pdf.save(`invoice_${order.unid}.pdf`);

  // 🧹 Cleanup
  root.unmount();
  document.body.removeChild(container);
}
