import * as XLSX from "xlsx";

/**
 * 📤 Export any array of JSON objects to Excel or CSV
 * @param {Array} data - Array of objects to export
 * @param {string} fileName - Name of the exported file
 * @param {string} sheetName - Sheet name (default: "Sheet1")
 * @param {string} format - "xlsx" or "csv"
 */
export const exportToExcel = (
  data,
  fileName = "export",
  sheetName = "Sheet1",
  format = "xlsx"
) => {
  if (!Array.isArray(data) || data.length === 0) {
    alert("⚠️ No data available to export!");
    return;
  }

  try {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    if (format === "csv") {
      XLSX.writeFile(wb, `${fileName}.csv`, { bookType: "csv" });
    } else {
      XLSX.writeFile(wb, `${fileName}.xlsx`, { bookType: "xlsx" });
    }

    console.log(`✅ Exported ${data.length} rows successfully.`);
  } catch (err) {
    console.error("❌ Export failed:", err);
    alert("Export failed! Please try again.");
  }
};

/**
 * 📥 Import Excel or CSV file and parse it into JSON
 * @param {File} file - The uploaded file (from input type="file")
 * @returns {Promise<Array>} Promise that resolves to parsed JSON data
 */
export const importFromExcel = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      alert("⚠️ Please select a file to import!");
      return reject("No file selected");
    }

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        console.log(`📥 Imported ${jsonData.length} rows`);
        resolve(jsonData);
      };
      reader.onerror = (error) => {
        console.error("❌ File read error:", error);
        alert("Failed to read file.");
        reject(error);
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("❌ Import failed:", error);
      reject(error);
    }
  });
};
