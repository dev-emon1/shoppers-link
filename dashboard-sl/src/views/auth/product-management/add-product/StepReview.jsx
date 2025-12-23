/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Edit3,
  CheckCircle2,
  Image as ImageIcon,
  ArrowLeft,
} from "lucide-react";
import Heading from "../../../../components/common/Heading";

const StepReview = ({ formData, onEdit, onBack, onSubmit }) => {
  const [openSection, setOpenSection] = useState([
    "basic",
    "variants",
    "media",
  ]);
  const sections = ["basic", "variants", "media", "desc", "meta"];

  const toggleSection = (section) =>
    setOpenSection((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );

  const expandAll = () => setOpenSection(sections);
  const collapseAll = () => setOpenSection([]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ===== Header ===== */}
      <div className="flex justify-between items-center mb-3">
        <Heading title="Review & Confirm Product Details" />
        <div className="flex items-center gap-2">
          <button
            onClick={collapseAll}
            className="text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
          >
            Collapse All
          </button>
          <button
            onClick={expandAll}
            className="text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
          >
            Expand All
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Please review all product information carefully before publishing. You
        can edit any section using the <strong>Edit</strong> button.
      </p>

      {/* ========== BASIC INFO ========== */}
      <ReviewSection
        title="Basic Information"
        isOpen={openSection.includes("basic")}
        onToggle={() => toggleSection("basic")}
        onEdit={() => onEdit(1)}
      >
        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-3 text-sm text-gray-700">
          {/* Vendor Info */}
          <div className="flex items-center gap-3 border border-gray-100 rounded-md p-2 bg-gray-50">
            <img
              src={formData.basicInfo.vendor?.avatar}
              alt="vendor"
              className="w-10 h-10 rounded-full border"
            />
            <div>
              <p className="font-medium text-gray-800">
                {formData.basicInfo.vendor?.name || "—"}
              </p>
              <p className="text-xs text-gray-500">
                {formData.basicInfo.vendor?.email}
              </p>
            </div>
          </div>

          <InfoRow label="Product Name" value={formData.basicInfo.name} />
          <InfoRow label="SKU" value={formData.basicInfo.sku} />
          <InfoRow label="Brand" value={formData.basicInfo.brand || "—"} />
          <InfoRow
            label="Category"
            value={formData.basicInfo.category || "—"}
          />
          <InfoRow
            label="Subcategory"
            value={formData.basicInfo.subcategory || "—"}
          />
          <InfoRow
            label="Child Category"
            value={formData.basicInfo.childCategory || "—"}
          />
          <InfoRow
            label="Status"
            value={
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${formData.basicInfo.status === "active"
                  ? "bg-green/10 text-green"
                  : "bg-red/10 text-red"
                  }`}
              >
                {formData.basicInfo.status}
              </span>
            }
          />
        </div>
      </ReviewSection>

      {/* ========== VARIANTS ========== */}
      <ReviewSection
        title="Variants & Pricing"
        isOpen={openSection.includes("variants")}
        onToggle={() => toggleSection("variants")}
        onEdit={() => onEdit(2)}
      >
        {formData.variants?.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200 rounded-md">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  {Object.keys(formData.variants[0].attributes || {}).map(
                    (attr) => (
                      <th key={attr} className="px-3 py-2 text-left capitalize">
                        {attr}
                      </th>
                    )
                  )}
                  <th className="px-3 py-2 text-left">SKU</th>
                  <th className="px-3 py-2 text-left">Price</th>
                  <th className="px-3 py-2 text-left">Discount</th>
                  <th className="px-3 py-2 text-left">Stock</th>
                </tr>
              </thead>
              <tbody>
                {formData.variants.map((v, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    {Object.values(v.attributes || {}).map((val, j) => (
                      <td key={j} className="px-3 py-2">
                        {val}
                      </td>
                    ))}
                    <td className="px-3 py-2">{v.sku}</td>
                    <td className="px-3 py-2">৳{v.price}</td>
                    <td className="px-3 py-2">{v.discount || 0}%</td>
                    <td className="px-3 py-2">{v.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No variants added.</p>
        )}
      </ReviewSection>

      {/* ========== MEDIA (IMAGES + COLOR) ========== */}
      <ReviewSection
        title="Product Media"
        isOpen={openSection.includes("media")}
        onToggle={() => toggleSection("media")}
        onEdit={() => onEdit(3)}
      >
        {formData.images?.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {formData.images.map((img, i) => (
              <div
                key={i}
                className={`relative w-24 h-24 rounded-lg overflow-hidden border ${img.id === formData.featured
                  ? "border-main ring-2 ring-main"
                  : "border-gray-200"
                  }`}
              >
                <img
                  src={img.preview || img.url}
                  alt="Product"
                  className="object-cover w-full h-full"
                />
                {img.id === formData.featured && (
                  <span className="absolute bottom-1 left-1 bg-yellow-400 text-white text-[10px] px-1.5 py-0.5 rounded">
                    Featured
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No main images uploaded.</p>
        )}

        {/* Color-based images */}
        {formData.colorImages &&
          Object.entries(formData.colorImages).map(([color, imgs]) => (
            <div key={color} className="mt-5">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                <ImageIcon size={14} className="text-main" /> {color} Images
              </h4>
              <div className="flex flex-wrap gap-3">
                {imgs.map((img, i) => (
                  <div
                    key={i}
                    className="relative w-20 h-20 rounded-md overflow-hidden border border-gray-200"
                  >
                    <img
                      src={img.preview || URL.createObjectURL(img.file)}
                      alt={`${color}-${i}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
      </ReviewSection>

      {/* ========== DESCRIPTION ========== */}
      <ReviewSection
        title="Product Description"
        isOpen={openSection.includes("desc")}
        onToggle={() => toggleSection("desc")}
        onEdit={() => onEdit(4)}
      >
        <div className="text-sm text-gray-700">
          <p>
            <strong>Short Description:</strong> {formData.shortDesc || "—"}
          </p>
          <div
            className="mt-3 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{
              __html: formData.longDesc || "<p>—</p>",
            }}
          />
        </div>
      </ReviewSection>

      {/* ========== META INFO ========== */}
      <ReviewSection
        title="Meta Info & SEO"
        isOpen={openSection.includes("meta")}
        onToggle={() => toggleSection("meta")}
        onEdit={() => onEdit(5)}
      >
        <ul className="text-sm text-gray-700 space-y-2">
          <li>
            <strong>Meta Title:</strong> {formData.metaTitle || "—"}
          </li>
          <li>
            <strong>Meta Description:</strong> {formData.metaDescription || "—"}
          </li>
          <li>
            <strong>Meta Keywords:</strong> {formData.metaKeywords || "—"}
          </li>
        </ul>
      </ReviewSection>

      {/* ========== FINAL ACTION BUTTONS ========== */}
      <div className="flex justify-between items-center mt-8 border-t pt-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-700 border border-gray-300 px-5 py-2 rounded-md hover:bg-gray-100 transition-all text-sm font-medium"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <button
          onClick={onSubmit}
          className="flex items-center gap-2 bg-main hover:bg-mainHover text-white px-6 py-2 rounded-md text-sm font-medium transition-all"
        >
          <CheckCircle2 size={18} />
          Publish Product
        </button>
      </div>
    </div>
  );
};

/* ======= Reusable Section Component ======= */
const ReviewSection = ({ title, isOpen, onToggle, onEdit, children }) => (
  <motion.div
    className="border border-border rounded-md bg-white shadow-sm"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <div
      className="flex justify-between items-center p-3 cursor-pointer bg-gray-50 border-b border-border"
      onClick={onToggle}
    >
      <h3 className="font-medium text-gray-800">{title}</h3>
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="text-main hover:text-mainHover text-sm font-medium flex items-center gap-1"
        >
          <Edit3 size={14} /> Edit
        </button>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
    </div>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

/* ======= Info Row ======= */
const InfoRow = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-xs text-gray-500">{label}</span>
    <span className="font-medium text-gray-800">{value}</span>
  </div>
);

export default StepReview;