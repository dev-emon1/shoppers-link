/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { Book, Search, UserCheck2 } from "lucide-react";
import Heading from "../../../../components/common/Heading";
import SearchInput from "../../../../components/common/SearchInput";
import axios from "axios";

const Category_API_URL = "http://127.0.0.1:8000/api/categories";
const Subcategory_API_URL = "http://127.0.0.1:8000/api/subCategories";
const ChildCategory_API_URL = "http://127.0.0.1:8000/api/childCategories";

const StepBasicInfo = ({ formData, onChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  // console.log(subcategories);

  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  // ===== Watched Fields =====
  const basicInfo = watch("basicInfo");
  const selectedCategory = basicInfo?.category || "";
  const selectedSubcategory = basicInfo?.subcategory || "";
  const selectedChild = basicInfo?.childCategory || "";
  const selectedVendor = basicInfo?.vendor || null;

  // ===== Dummy Vendors =====
  const vendors = useMemo(
    () => [
      { id: "V-1001", name: "Tech Haven", email: "techhaven@gmail.com", avatar: "https://i.pravatar.cc/150?img=4" },
      { id: "V-1002", name: "Fashion World", email: "contact@fashionworld.com", avatar: "https://i.pravatar.cc/150?img=2" },
      { id: "V-1003", name: "Home Comforts", email: "homecomforts@gmail.com", avatar: "https://i.pravatar.cc/150?img=6" },
    ],
    []
  );

  // ===== Fetch categories/subcategories/childCategories =====
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, subRes, childRes] = await Promise.all([
          axios.get(Category_API_URL),
          axios.get(Subcategory_API_URL),
          axios.get(ChildCategory_API_URL),
        ]);
        setCategories(catRes.data.data || []);
        setSubcategories(subRes.data.data || []);
        setChildCategories(childRes.data.data || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchData();
  }, []);

  // ===== Filtered subcategories/child categories =====
  const availableSubcategories = useMemo(() => {
    return subcategories.filter((s) => s.category_id === selectedCategory);
  }, [selectedCategory, subcategories]);

  const availableChildCategories = useMemo(() => {
    return childCategories.filter((c) => c.sub_category_id === selectedSubcategory);
  }, [selectedSubcategory, childCategories]);

  // ===== Vendor Filter =====
  const filteredVendors = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return vendors;
    return vendors.filter((v) => v.name.toLowerCase().includes(q) || v.id.toLowerCase().includes(q));
  }, [searchTerm, vendors]);

  const handleVendorSelect = (vendor) => {
    setValue("basicInfo.vendor", vendor, { shouldValidate: true });
    onChange("vendor", vendor);
    setSearchTerm("");
  };

  // ===== Category Logic =====
  const handleCategoryChange = (value) => {
    setValue("basicInfo.category", Number(value));
    setValue("basicInfo.subcategory", "");
    setValue("basicInfo.childCategory", "");
    onChange("category", Number(value));
    onChange("subcategory", "");
    onChange("childCategory", "");
  };

  const handleSubcategoryChange = (value) => {
    setValue("basicInfo.subcategory", Number(value));
    setValue("basicInfo.childCategory", "");
    onChange("subcategory", Number(value));
    onChange("childCategory", "");
  };

  const handleChildCategoryChange = (value) => {
    setValue("basicInfo.childCategory", Number(value));
    onChange("childCategory", Number(value));
  };

  // ===== Helper for Red Border =====
  const errorInputClass = (hasError) =>
    `border rounded-md px-3 py-2 outline-none transition-all duration-300 ${hasError
      ? "border-red ring-1 ring-red/50 bg-red/5 animate-[fade_0.4s_ease-in]"
      : "border-border focus:ring-1 focus:ring-main"
    }`;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="mb-3 flex items-center gap-2"><Book /><Heading title="Basic Information" /></div>

      {/* Basic Fields */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Product Name</label>
          <input type="text" {...register("basicInfo.name")} placeholder="e.g., Apple iPhone 15 Pro Max" className={errorInputClass(errors.basicInfo?.name)} />
          {errors.basicInfo?.name && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red text-xs mt-1">{errors.basicInfo.name.message}</motion.p>}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">SKU</label>
          <input type="text" {...register("basicInfo.sku")} placeholder="e.g., PRD-000123" className={errorInputClass(errors.basicInfo?.sku)} />
          {errors.basicInfo?.sku && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red text-xs mt-1">{errors.basicInfo.sku.message}</motion.p>}
        </div>
      </div>

      {/* Category Chain */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Category */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Category</label>
          <select value={selectedCategory} onChange={(e) => handleCategoryChange(e.target.value)} className={errorInputClass(errors.basicInfo?.category)}>
            <option value="">Select Category</option>
            {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>

        {/* Subcategory */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Subcategory</label>
          <select value={selectedSubcategory} onChange={(e) => handleSubcategoryChange(e.target.value)} disabled={!selectedCategory} className="border border-border rounded-md px-3 py-2 outline-none bg-white focus:ring-1 focus:ring-main disabled:bg-gray-100">
            <option value="">Select Subcategory</option>
            {availableSubcategories.map((sub) => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
          </select>
        </div>

        {/* Child Category */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Child Category</label>
          <select value={selectedChild} onChange={(e) => handleChildCategoryChange(e.target.value)} disabled={!selectedSubcategory} className="border border-border rounded-md px-3 py-2 outline-none bg-white focus:ring-1 focus:ring-main disabled:bg-gray-100">
            <option value="">Select Child Category</option>
            {availableChildCategories.map((child) => <option key={child.id} value={child.id}>{child.name}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};

export default StepBasicInfo;
