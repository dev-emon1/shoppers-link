/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { Book, Search, UserCheck2 } from "lucide-react";
import Heading from "../../../../components/common/Heading";
import API from "../../../../utils/api";


const StepBasicInfo = ({ formData, onChange }) => {
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
  // console.log(basicInfo);

  // ===== Fetch categories/subcategories/childCategories =====
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, subRes, childRes] = await Promise.all([
          API.get("/categories"),
          API.get("/subCategories"),
          API.get("/childCategories"),
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

  // ===== Category Logic =====
  const handleCategoryChange = (value) => {
    const selected = categories.find((c) => c.id === Number(value));

    setValue("basicInfo.category", Number(value));     // Save ID
    setValue("basicInfo.categoryName", selected?.name || ""); // Save name

    setValue("basicInfo.subcategory", "");
    setValue("basicInfo.childCategory", "");

    onChange("category", Number(value));
    onChange("categoryName", selected?.name || "");
    onChange("subcategory", "");
    onChange("childCategory", "");
  };


  const handleSubcategoryChange = (value) => {
    const selected = subcategories.find((s) => s.id === Number(value));

    setValue("basicInfo.subcategory", Number(value));
    setValue("basicInfo.subcategoryName", selected?.name || "");

    setValue("basicInfo.childCategory", "");

    onChange("subcategory", Number(value));
    onChange("subcategoryName", selected?.name || "");
    onChange("childCategory", "");
  };


  const handleChildCategoryChange = (value) => {
    const selected = childCategories.find((c) => c.id === Number(value));

    setValue("basicInfo.childCategory", Number(value));
    setValue("basicInfo.childCategoryName", selected?.name || "");

    onChange("childCategory", Number(value));
    onChange("childCategoryName", selected?.name || "");
  };
  const generatePrefix = (name) => {
    if (!name) return "";

    return name
      .trim()
      .split(" ")
      .map(word => {
        if (!isNaN(word)) {
          return word; // full number
        }
        return word.charAt(0).toUpperCase();
      })
      .join("");
  };
  const generateRandomSuffix = () => {
    return Math.floor(100 + Math.random() * 900).toString();
  };
  const generateSKU = (name) => {
    const prefix = generatePrefix(name);
    const randomNumber = generateRandomSuffix();
    return `${prefix}-${randomNumber}`;
  };
  const productName = watch("basicInfo.name");

  useEffect(() => {
    if (productName && productName.length > 1) {
      const autoSKU = generateSKU(productName);
      setValue("basicInfo.sku", autoSKU);
    }
  }, [productName, setValue]);


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
          <input type="text" disabled {...register("basicInfo.sku")} placeholder="e.g., PRD-000123" className={errorInputClass(errors.basicInfo?.sku)} />
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
