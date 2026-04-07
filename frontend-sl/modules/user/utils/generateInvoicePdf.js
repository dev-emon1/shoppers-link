import { createRoot } from "react-dom/client";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import OrderInvoiceTemplate from "@/modules/user/dashboard/order/OrderInvoiceTemplate";

<<<<<<< HEAD
/**
 * Centralized PDF Generator
 * -----------------------------------
 * - Used by User + Admin
 * - Optimized for size & quality
 * - Single source of truth
 */
=======
>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b
export async function generateInvoicePdf({
  order,
  billing,
  activeVendorOrders,
  totals,
}) {
<<<<<<< HEAD
  // Offscreen render container
=======
  // 🔹 Create offscreen container
>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-10000px";
  container.style.top = "0";
<<<<<<< HEAD
  container.style.background = "white";
  document.body.appendChild(container);

  const root = createRoot(container);
=======
  container.style.background = "#fff";
  container.style.width = "820px"; // A4 safe width
  document.body.appendChild(container);

  const root = createRoot(container);

>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b
  root.render(
    <OrderInvoiceTemplate
      order={order}
      billing={billing}
      activeVendorOrders={activeVendorOrders}
      totals={totals}
    />,
  );

<<<<<<< HEAD
  // Wait for render
  await new Promise((r) => setTimeout(r, 300));

  const element = document.getElementById("invoice-template");

  const canvas = await html2canvas(element, {
    scale: 1.25,
=======
  // ⏳ Wait for render
  await new Promise((r) => setTimeout(r, 400));

  const element = document.getElementById("invoice-template");

  // 🔥 HIGH QUALITY CANVAS
  const canvas = await html2canvas(element, {
    scale: 2, // 🔥 HIGH QUALITY
>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

<<<<<<< HEAD
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
=======
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
>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b
    position,
    imgWidth,
    imgHeight,
    undefined,
    "FAST",
  );
<<<<<<< HEAD
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position -= pageHeight;
    pdf.addPage();
    pdf.addImage(
      imgData,
      "JPEG",
      0,
=======

  heightLeft -= pageHeight;

  // 🔹 Multi page support
  while (heightLeft > 0) {
    position = heightLeft - imgHeight + margin;
    pdf.addPage();

    pdf.addImage(
      imgData,
      "JPEG",
      margin,
>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b
      position,
      imgWidth,
      imgHeight,
      undefined,
      "FAST",
    );
<<<<<<< HEAD
=======

>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b
    heightLeft -= pageHeight;
  }

  pdf.save(`invoice_${order.unid}.pdf`);

<<<<<<< HEAD
  // Cleanup
=======
  // 🧹 Cleanup
>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b
  root.unmount();
  document.body.removeChild(container);
}
