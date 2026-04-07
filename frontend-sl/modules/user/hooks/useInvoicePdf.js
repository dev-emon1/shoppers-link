"use client";

import html2pdf from "html2pdf.js";

export default function useInvoicePdf() {
  const downloadPdf = (elementId, fileName = "invoice.pdf") => {
    const element = document.getElementById(elementId);

    if (!element) return;

    const opt = {
      margin: 0.5,
      filename: fileName,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait",
      },
    };

    html2pdf().set(opt).from(element).save();
  };

  return { downloadPdf };
}
