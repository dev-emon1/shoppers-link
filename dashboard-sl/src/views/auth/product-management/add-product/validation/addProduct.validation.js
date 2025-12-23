/* eslint-disable no-unused-vars */
import * as Yup from "yup";

export const makeAddProductSchema = (ctx) =>
  Yup.object().shape({
    // ===================== BASIC INFO =====================
    basicInfo: Yup.object().shape({
      vendor: Yup.object().nullable().required("Vendor selection is required"),
      name: Yup.string()
        .trim()
        .min(3, "Product name must be at least 3 characters")
        .max(150, "Product name cannot exceed 150 characters")
        .required("Product name is required"),
      sku: Yup.string()
        .trim()
        .min(2, "SKU must be at least 2 characters")
        .max(50, "SKU cannot exceed 50 characters")
        .required("SKU is required"),
      brand: Yup.string().nullable(), // brand optional
      category: Yup.string().trim().required("Category is required"),
      subcategory: Yup.string().trim().nullable(),
      childCategory: Yup.string().trim().nullable(),
      status: Yup.string()
        .oneOf(["active", "inactive"])
        .default("active")
        .required("Status is required"),
    }),

    // Keep variantMeta as an object; individual constraints can be added per your UI
    variantMeta: Yup.object().nullable(),

    // ===================== VARIANTS =====================
    variants: Yup.array()
      .of(
        Yup.object().shape({
          sku: Yup.string().required("Variant SKU required"),
          price: Yup.number()
            .transform((v, o) => (o === "" ? undefined : v))
            .typeError("Price must be a valid number")
            .min(1, "Price must be at least 1")
            .required("Price is required"),
          discount: Yup.number()
            .transform((v, o) => (o === "" ? 0 : v))
            .typeError("Discount must be a valid number")
            .min(0, "Discount cannot be negative")
            .max(100, "Maximum discount is 100%")
            .nullable(),
          stock: Yup.number()
            .transform((v, o) => (o === "" ? undefined : v))
            .typeError("Stock must be a valid number")
            .min(0, "Stock cannot be negative")
            .required("Stock is required"),
        })
      )
      .min(1, "At least one variant is required")
      .required("Please configure at least one product variant"),

    // ===================== MEDIA VALIDATION =====================
    images: Yup.array()
      .min(0)
      .test("media-validation", null, function (images) {
        const { variantMeta, colorImages, featured } = this.parent;

        const colorId = ctx?.colorAttributeId;
        const selectedColorValues = colorId
          ? variantMeta?.selectedValues?.[colorId] || []
          : [];

        const hasColor =
          Array.isArray(selectedColorValues) && selectedColorValues.length > 0;

        // ===== COLOR-WISE VALIDATION =====
        if (hasColor) {
          for (const clr of selectedColorValues) {
            if (!colorImages?.[clr]?.length) {
              return this.createError({
                path: `colorImages.${clr}`,
                message: `${clr} image is required`,
              });
            }
          }
          return true;
        }

        // ===== NORMAL IMAGE VALIDATION =====
        if (!Array.isArray(images) || images.length < 2) {
          return this.createError({
            path: "images",
            message: "Please upload at least 2 product images",
          });
        }
        if (images.length > 6) {
          return this.createError({
            path: "images",
            message: "You can upload up to 6 images only",
          });
        }
        return true;
      })
      .required("Product images are required"),

    colorImages: Yup.object().nullable(),

    // featured can be null, but if provided should match one of the uploaded images' ids (UI ensures this)
    featured: Yup.mixed().nullable(),

    // ===================== DESCRIPTION =====================
    shortDesc: Yup.string()
      .trim()
      .min(10, "Short description must be at least 10 characters")
      .required("Short description is required"),
    longDesc: Yup.string()
      .trim()
      .min(30, "Long description must be at least 30 characters")
      .required("Long description is required"),

    // ===================== META INFO =====================
    metaTitle: Yup.string()
      .trim()
      .max(60, "Meta title cannot exceed 60 characters")
      .required("Meta title is required"),

    metaDescription: Yup.string()
      .trim()
      .max(160, "Meta description cannot exceed 160 characters")
      .required("Meta description is required"),

    metaKeywords: Yup.string()
      .trim()
      .nullable()
      .max(200, "Meta keywords cannot exceed 200 characters"),
  });
