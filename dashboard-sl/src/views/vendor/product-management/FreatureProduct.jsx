import React, { useState, useEffect, useCallback } from "react";
import PageHeader from "../../../components/common/PageHeader";
import Table from "../../../components/table/Table";
import Pagination from "../../../components/Pagination";
import IconButton from "../../../components/ui/IconButton";
import { TbFileExcel, TbPdf, TbScanEye } from "react-icons/tb";
import { exportToExcel } from "../../../utils/excelHelper";
import { useNavigate } from "react-router-dom";
import API from "../../../../src/utils/api";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { useAuth } from "../../../utils/AuthContext";
import { format } from "date-fns";
import FeatureProductQuickView from "../../../components/ui/FeatureProductQuickView";
import { toast } from "react-toastify";

const AllFeaturedProducts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewProduct, setViewProduct] = useState(null);

  const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

  // console.log(featuredItems);
  // Fetch Featured Products
  const fetchFeatured = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/vendor/featured");
      const items = res.data.data || [];
      // console.log("data", items);

      const formatted = items.map((item) => {
        // Find the specific variant that matches the featured variant ID
        const specificVariant = item.product.variants?.find(
          (v) => v.id === item.product_variant_id
        );
        const variantSpecificImage = item.product.images?.find(
          (img) => img.variant_id === item.product_variant_id
        );

        // 3. Fallback to the product's primary image if no variant image exists
        const primaryImage = item.product.images?.find((img) => img.is_primary === 1);
        return {
          id: item.id, // Use the Featured record ID for the 'Remove' action
          name: item.product.name,
          sku: item.product.sku,
          display_image: variantSpecificImage?.image_path || primaryImage?.image_path,
          images: item.product.images || [],
          category: item.product.category || {},
          sub_category: item.product.sub_category || {},
          child_category: item.product.child_category || {},
          product_id: item.product_id,
          product_variant_id: item.product_variant_id,

          // Featured info
          badge_text: item.badge_text,
          badge_color: item.badge_color || "#ef4444",
          ends_at: item.ends_at,
          is_active: item.is_active,

          // FIX: Assign the single specific variant object, not the whole array
          featured_variant: specificVariant || null,
        };
      });
      setFeaturedItems(formatted);
    } catch (error) {
      console.error("Failed to fetch featured products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

  // Search + Pagination
  const filtered = featuredItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const currentData = filtered.slice((page - 1) * perPage, page * perPage);

  // PDF Export
  const exportToPDF = () => {
    if (!currentData.length) return toast.error("No data to export!");

    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(20);
    doc.setTextColor("#E07D42");
    doc.text("My Featured Products", 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Total: ${filtered.length} items`, 14, 38);

    const rows = currentData.map((item) => [
      item.name,
      item.sku,
      item.badge_text || "—",
      item.featured_variant
        ? Object.values(
          JSON.parse(item.featured_variant.attributes || "{}")
        ).join(" • ")
        : "Whole Product",
      item.featured_variant?.price || "—",
      item.featured_variant?.stock || "—",
      item.ends_at
        ? format(new Date(item.ends_at), "dd MMM yyyy")
        : "No expiry",
      item.is_active ? "Active" : "Inactive",
    ]);

    autoTable(doc, {
      head: [
        [
          "Product",
          "SKU",
          "Badge",
          "Variant",
          "Price",
          "Stock",
          "Expires",
          "Status",
        ],
      ],
      body: rows,
      startY: 45,
      theme: "grid",
      headStyles: { fillColor: "#E07D42", textColor: 255 },
      styles: { fontSize: 9, cellPadding: 5 },
    });

    doc.save("my-featured-products.pdf");
    toast.success("Featured products exported to PDF successfully!");
  };

  // Remove from Featured
  const handleRemove = async (featuredId) => {
    if (!confirm("Remove this product from Featured?")) return;
    try {
      await API.delete(`/featuredProducts/${featuredId}`);
      fetchFeatured();
    } catch (err) {
      alert("Failed to remove");
    }
  };

  // Table Columns
  const columns = [
    {
      key: "no",
      label: "No",
      render: (_, i) => (page - 1) * perPage + i + 1,
      className: "text-center w-12 font-medium",
    },
    // {
    //   key: "image",
    //   label: "Image",
    //   render: (item) => {
    //     const img = item.images?.find((i) => i.is_primary)?.image_path;
    //     return (
    //       <img
    //         src={img ? `${IMAGE_URL}/${img}` : "/placeholder.png"}
    //         alt={item.name}
    //         className="w-12 h-12 rounded object-cover border"
    //       />
    //     );
    //   },
    // },
    {
      key: "image",
      label: "Image",
      render: (item) => (
        <img
          src={item.display_image ? `${IMAGE_URL}/${item.display_image}` : "/placeholder.png"}
          alt={item.name}
          className="w-12 h-12 rounded object-cover border shadow-sm hover:scale-110 transition-transform"
        />
      ),
    },
    {
      key: "name",
      label: "Product",
      render: (item) => (
        <div>
          <div className="font-medium">{item.name}</div>
          {item.badge_text && (
            <span
              className="inline-block px-3 py-1 mt-1 text-xs font-bold text-white rounded-full"
              style={{ backgroundColor: item.badge_color }}
            >
              {item.badge_text.toUpperCase()}
            </span>
          )}
        </div>
      ),
    },
    { key: "sku", label: "SKU", render: (i) => i.sku },
    {
      key: "variant",
      label: "Featured Variant",
      render: (item) => (
        <div className="text-sm">
          {item.featured_variant ? (
            <>
              <div className="font-medium">{item.featured_variant.sku}</div>
              <div className="text-xs text-gray-600">
                {Object.values(
                  JSON.parse(item.featured_variant.attributes || "{}")
                ).join(" • ")}
              </div>
            </>
          ) : (
            <span className="text-gray-500 italic">Whole Product</span>
          )}
        </div>
      ),
    },
    {
      key: "stock",
      label: "Stock",
      render: (item) => item.featured_variant?.stock || "—",
      className: "text-center",
    },
    {
      key: "expires",
      label: "Expires",
      render: (item) => {
        if (!item.ends_at) return "No expiry";
        const date = new Date(item.ends_at);
        const isActive = date > new Date();
        return (
          <div className={isActive ? "text-green-600" : "text-red-600"}>
            {format(date, "dd MMM yyyy")}
          </div>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (item) => (
        <div className="flex justify-center gap-3">
          <IconButton
            icon={TbScanEye}
            bgColor="bg-main"
            hoverBgColor="bg-mainHover"
            onClick={() => setViewProduct(item)}
          />
          <button
            onClick={() => handleRemove(item.id)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Remove
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="px-4 py-6">
      <PageHeader
        title="My Featured Products"
        searchTerm={searchTerm}
        onSearch={(e) => setSearchTerm(e.target.value)}
        addLabel="Add New Featured"
        onAddClick={() => navigate("/vendor/products/add-feature-product")}
        rightActions={
          <>
            <button
              onClick={exportToPDF}
              className="flex items-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50"
            >
              <TbPdf /> PDF
            </button>
            <button
              onClick={() =>
                exportToExcel(
                  currentData.map((i) => ({
                    Product: i.name,
                    SKU: i.sku,
                    Badge: i.badge_text || "—",
                    Variant: i.featured_variant
                      ? Object.values(
                        JSON.parse(i.featured_variant.attributes || "{}")
                      ).join(" • ")
                      : "Whole Product",
                    Expires: i.ends_at
                      ? format(new Date(i.ends_at), "dd MMM yyyy")
                      : "No expiry",
                    Status: i.is_active ? "Active" : "Inactive",
                  })),
                  "featured-products"
                )
              }
              className="flex items-center gap-2 px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50"
            >
              <TbFileExcel /> Excel
            </button>
          </>
        }
      />

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <Table
          columns={columns}
          data={currentData}
          loading={loading}
          enableCheckbox={false}
        />

        <div className="p-4 border-t bg-gray-50">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            perPage={perPage}
            totalItems={filtered.length} // এটাই ম্যাজিক!
            onPageChange={setPage}
            onPerPageChange={setPerPage}
          />
        </div>
      </div>

      {viewProduct && (
        <FeatureProductQuickView
          product={viewProduct}
          onClose={() => setViewProduct(null)}
        />
      )}
    </div>
  );
};

export default AllFeaturedProducts;
