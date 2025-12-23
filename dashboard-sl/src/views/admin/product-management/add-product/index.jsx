/* eslint-disable no-unused-vars */
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Heading from "../../../../components/common/Heading";
import StepBasicInfo from "./StepBasicInfo";
import StepVariants from "./StepVariants";
import StepMedia from "./StepMedia";
import StepDescription from "./StepDescription";
import StepMetaInfo from "./StepMetaInfo";
import StepReview from "./StepReview";

import { makeAddProductSchema } from "./validation/addProduct.validation";
import { useNavigate } from "react-router-dom";

const DEFAULT_VALUES = {
  basicInfo: {
    vendor: null,
    name: "",
    sku: "",
    brand: "",
    category: "",
    subcategory: "",
    childCategory: "",
    status: "active",
  },
  variants: [],
  variantMeta: {},
  images: [],
  colorImages: {},
  featured: null,
  shortDesc: "",
  longDesc: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
};

const steps = [
  { id: 1, title: "Basic Info" },
  { id: 2, title: "Variants" },
  { id: 3, title: "Media Upload" },
  { id: 4, title: "Description" },
  { id: 5, title: "Meta Info" },
  { id: 6, title: "Review & Submit" },
];

const AddProduct = () => {
  const [step, setStep] = useState(1);
  const [attributes, setAttributes] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/attributes")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAttributes(data.data);
        }
      })
      .catch((err) => console.error("Failed to fetch attributes:", err));
  }, []);

  const colorAttributeId = useMemo(
    () => attributes.find((a) => a.name?.toLowerCase() === "color")?.id,
    [attributes]
  );

  // === RHF Setup ===
  const methods = useForm({
    resolver: yupResolver(makeAddProductSchema({ colorAttributeId })),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: DEFAULT_VALUES,
  });

  const { setValue, trigger, handleSubmit, formState, watch, getValues } =
    methods;

  const data = watch();
  // console.log(data);

  const updateFormData = useCallback(
    (key, value, options = {}) => {
      if (key !== "basicInfo") {
        setValue(key, value, {
          shouldDirty: true,
          shouldValidate: false,
          ...options,
        });
        return;
      }

      // basicInfo partial update → merge
      const prev = getValues("basicInfo") || {};
      const next = { ...prev, ...(value || {}) };

      setValue("basicInfo", next, {
        shouldDirty: true,
        shouldValidate: false,
        ...options,
      });
    },
    [setValue, getValues]
  );

  // === STEP VALIDATION HANDLER ===
  const handleNext = useCallback(async () => {
    let valid = true;

    if (step === 1)
      valid = await trigger([
        "basicInfo.vendor",
        "basicInfo.name",
        "basicInfo.sku",
        "basicInfo.brand",
        "basicInfo.category",
        "basicInfo.subcategory",
        "basicInfo.childCategory",
        "basicInfo.status",
      ]);

    if (step === 2) valid = await trigger(["variants", "variantMeta"]);
    if (step === 3)
      valid = await trigger(["images", "colorImages", "featured"]);
    if (step === 4) valid = await trigger(["shortDesc", "longDesc"]);
    if (step === 5)
      valid = await trigger(["metaTitle", "metaDescription", "metaKeywords"]);

    if (!valid) {
      console.log("❌ Validation failed at step:", step);
      return;
    }

    if (step < steps.length) setStep(step + 1);
  }, [step, trigger]);

  const handleBack = useCallback(() => {
    if (step > 1) setStep(step - 1);
  }, [step]);
  const navigate = useNavigate();
  const handlePublish = useCallback((formData) => {
    const submitData = new FormData();

    submitData.append("name", formData.basicInfo.name);
    submitData.append("sku", formData.basicInfo.sku);
    submitData.append("brand", formData.basicInfo.brand || "");
    submitData.append("category", formData.basicInfo.category);
    if (formData.basicInfo.subcategory)
      submitData.append("subcategory", formData.basicInfo.subcategory);
    if (formData.basicInfo.childCategory)
      submitData.append("childcategory", formData.basicInfo.childCategory);
    submitData.append("status", formData.basicInfo.status);
    submitData.append("short_description", formData.shortDesc);
    submitData.append("long_description", formData.longDesc);
    if (formData.metaTitle) submitData.append("meta_title", formData.metaTitle);
    if (formData.metaDescription)
      submitData.append("meta_description", formData.metaDescription);
    if (formData.metaKeywords)
      submitData.append("meta_keywords", formData.metaKeywords);

    // variants
    formData.variants.forEach((v, i) => {
      Object.entries(v.attributes).forEach(([attr, val]) => {
        submitData.append(`variants[${i}][attributes][${attr}]`, val);
      });
      submitData.append(`variants[${i}][sku]`, v.sku);
      submitData.append(`variants[${i}][price]`, v.price);
      if (v.discount) submitData.append(`variants[${i}][discount]`, v.discount);
      submitData.append(`variants[${i}][stock]`, v.stock);
    });

    // variantMeta
    (formData.variantMeta.selectedAttributes || []).forEach((id, i) => {
      submitData.append(`variantMeta[selectedAttributes][${i}]`, id);
    });
    Object.entries(formData.variantMeta.selectedValues || {}).forEach(
      ([attrId, vals]) => {
        vals.forEach((val, j) => {
          submitData.append(
            `variantMeta[selectedValues][${attrId}][${j}]`,
            val
          );
        });
      }
    );

    // images
    formData.images.forEach((img) => {
      submitData.append("images[]", img.file);
    });

    // colorImages
    Object.entries(formData.colorImages || {}).forEach(([color, imgs]) => {
      if (imgs.length) submitData.append(`color_images[${color}]`, imgs[0].file);
    });

    // featured
    let featuredStr = null;
    const imgIndex = formData.images.findIndex(
      (img) => img.id === formData.featured
    );
    if (imgIndex !== -1) {
      featuredStr = `general-${imgIndex}`;
    } else {
      for (const [color, imgs] of Object.entries(formData.colorImages)) {
        if (imgs.length && imgs[0].id === formData.featured) {
          featuredStr = `color-${color}`;
          break;
        }
      }
    }
    if (featuredStr) submitData.append("featured", featuredStr);

    fetch("http://127.0.0.1:8000/api/products", {
      method: "POST",
      body: submitData,
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log(data);
          alert("Product created successfully!");
          navigate("/admin/products/all-products");
        } else {
          alert("Error: " + data.message);
        }
      })
      .catch((err) => {
        alert("Error: " + err.message);
      });
  }, []);

  // === RENDER STEP ===
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StepBasicInfo
            formData={data.basicInfo}
            onChange={(key, val, opts) =>
              updateFormData("basicInfo", { [key]: val }, opts)
            }
            errors={formState.errors?.basicInfo}
          />
        );
      case 2:
        return (
          <StepVariants
            formData={data}
            onChange={updateFormData}
            errors={{
              variants: formState.errors?.variants,
              variantMeta: formState.errors?.variantMeta,
            }}
            attributes={attributes}
          />
        );
      case 3:
        return (
          <StepMedia
            formData={data}
            onChange={updateFormData}
            errors={{
              images: formState.errors?.images,
              colorImages: formState.errors?.colorImages,
              featured: formState.errors?.featured,
            }}
            attributes={attributes}
          />
        );
      case 4:
        return (
          <StepDescription
            formData={data}
            onChange={updateFormData}
            errors={{
              shortDesc: formState.errors?.shortDesc,
              longDesc: formState.errors?.longDesc,
            }}
          />
        );
      case 5:
        return (
          <StepMetaInfo
            formData={data}
            onChange={updateFormData}
            errors={{
              metaTitle: formState.errors?.metaTitle,
              metaDescription: formState.errors?.metaDescription,
              metaKeywords: formState.errors?.metaKeywords,
            }}
          />
        );
      case 6:
        return (
          <StepReview
            formData={data}
            onEdit={(step) => setStep(step)}
            onBack={handleBack}
            onSubmit={methods.handleSubmit(handlePublish)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handlePublish)}>
        <div className="px-4 pb-10">
          {/* ===== Page Heading ===== */}
          <div className="flex justify-between items-center mb-5">
            <Heading title="Add New Product (Vendor Upload)" />
            <p className="text-sm text-gray-500">
              Step {step} of {steps.length}
            </p>
          </div>

          {/* ===== Step Progress Bar ===== */}
          <div className="flex items-center justify-between mb-6 relative">
            {steps.map((s, i) => (
              <div key={s.id} className="flex-1 relative">
                {i < steps.length - 1 && (
                  <div
                    className={`absolute top-3 left-1/2 w-full h-[2px] ${i + 1 < step ? "bg-green" : "bg-gray-300"
                      }`}
                  />
                )}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 flex items-center justify-center rounded-full text-white text-sm font-semibold transition-all ${s.id === step
                      ? "bg-main z-10"
                      : s.id < step
                        ? "bg-green z-10"
                        : "bg-gray-300 z-10"
                      }`}
                  >
                    {s.id}
                  </div>
                  <p
                    className={`text-[11px] mt-1 font-medium ${s.id === step ? "text-main" : "text-gray-500"
                      }`}
                  >
                    {s.title}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ===== Step Content ===== */}
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-5 rounded-md shadow-md"
          >
            {renderStep()}
          </motion.div>

          {/* ===== Navigation Buttons (Except Review Step) ===== */}
          {step < steps.length && (
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 1}
                className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${step === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
              >
                ← Back
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="bg-main hover:bg-mainHover text-white px-6 py-2 rounded-md text-sm font-medium transition-all"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default AddProduct;