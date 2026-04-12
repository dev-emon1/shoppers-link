// @/modules/user/utils/generateInvoicePdf.js

import { createRoot } from "react-dom/client";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import OrderInvoiceTemplate from "@/modules/user/dashboard/order/OrderInvoiceTemplate";
import { getImageAsBase64 } from "@/lib/utils/image";

export async function generateInvoicePdf({
  order,
  billing,
  activeVendorOrders,
  totals,
}) {
  try {
    console.log("=== Starting Invoice PDF Generation ===");
    console.log("Order UNID:", order?.unid);
    console.log("Number of active vendors:", activeVendorOrders?.length);

    // Step 1: Convert all vendor logos to base64
    console.log("Converting vendor logos to base64...");

    const vendorLogosBase64 = await Promise.all(
      (activeVendorOrders || []).map(async (vo, index) => {
        const logoPath = vo?.vendor?.logo;
        console.log(
          `Vendor ${index + 1} (${vo?.vendor?.shop_name}) Logo Path:`,
          logoPath,
        );

        if (!logoPath) {
          console.warn(`Vendor ${index + 1} has no logo`);
          return null;
        }

        const base64 = await getImageAsBase64(logoPath);
        console.log(
          `Vendor ${index + 1} Base64 Result:`,
          base64 ? "✅ SUCCESS" : "❌ FAILED",
        );

        return base64;
      }),
    );

    console.log(
      "Final vendorLogosBase64 array:",
      vendorLogosBase64.map((b, i) =>
        b ? `Logo ${i + 1}: OK` : `Logo ${i + 1}: NULL`,
      ),
    );

    // 🔹 Create offscreen container
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "-10000px";
    container.style.top = "0";
    container.style.background = "#fff";
    container.style.width = "820px";
    document.body.appendChild(container);

    const root = createRoot(container);

    root.render(
      <OrderInvoiceTemplate
        order={order}
        billing={billing}
        activeVendorOrders={activeVendorOrders}
        vendorLogosBase64={vendorLogosBase64} // ← Base64 logos passing
        totals={totals}
      />,
    );

    // Wait longer for images to load properly
    console.log("Waiting for render and image loading...");
    await new Promise((r) => setTimeout(r, 1200));

    const element = document.getElementById("invoice-template");

    if (!element) {
      throw new Error("Invoice template element not found in DOM");
    }

    console.log("Starting html2canvas capture...");

    // High quality canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: element.offsetWidth,
      height: element.offsetHeight,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.92);

    console.log("Canvas captured successfully, generating PDF...");

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

    // First page
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

    // Multi-page support
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

    pdf.save(`invoice_${order.unid || "unknown"}.pdf`);
    console.log("PDF saved successfully!");

    // Cleanup
    root.unmount();
    document.body.removeChild(container);
  } catch (error) {
    console.error("❌ Error generating invoice PDF:", error);
    alert("Failed to generate invoice PDF.\n\nError: " + error.message);
  }
}
