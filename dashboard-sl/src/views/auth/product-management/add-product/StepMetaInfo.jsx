/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import Heading from "../../../../components/common/Heading";

const StepMetaInfo = ({ formData, onChange, errors }) => {
  const MAX_TITLE = 60;
  const MAX_DESC = 160;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ===== Page Header ===== */}
      <Heading title="Product Meta Info & SEO Optimization" />

      {/* ===== Meta Title & Keywords ===== */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Meta Title */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 flex justify-between items-center">
            <span>Meta Title</span>
            <span
              className={`text-xs ${(formData.metaTitle?.length || 0) > MAX_TITLE
                ? "text-red"
                : "text-gray-500"
                }`}
            >
              {formData.metaTitle?.length || 0}/{MAX_TITLE}
            </span>
          </label>
          <input
            type="text"
            maxLength={MAX_TITLE}
            className={`border border-border rounded-md p-2 text-sm outline-none focus:ring-1 ${errors?.metaTitle ? "focus:ring-red" : "focus:ring-main"
              }`}
            placeholder="Enter SEO title (max 60 chars)"
            value={formData.metaTitle || ""}
            onChange={(e) => onChange("metaTitle", e.target.value)}
          />
          {errors?.metaTitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red text-xs"
            >
              {errors.metaTitle.message}
            </motion.p>
          )}
        </div>

        {/* Meta Keywords */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Meta Keywords
          </label>
          <input
            type="text"
            className={`border border-border rounded-md p-2 text-sm outline-none focus:ring-1 ${errors?.metaKeywords ? "focus:ring-red" : "focus:ring-main"
              }`}
            placeholder="Enter keywords (comma separated)"
            value={formData.metaKeywords || ""}
            onChange={(e) => onChange("metaKeywords", e.target.value)}
          />
          {errors?.metaKeywords && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red text-xs"
            >
              {errors.metaKeywords.message}
            </motion.p>
          )}
          <p className="text-xs text-gray-500">
            e.g. shoes, running, sportswear
          </p>
        </div>
      </div>

      {/* ===== Meta Description ===== */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700 flex justify-between items-center">
          <span>Meta Description</span>
          <span
            className={`text-xs ${(formData.metaDescription?.length || 0) > MAX_DESC
              ? "text-red"
              : "text-gray-500"
              }`}
          >
            {formData.metaDescription?.length || 0}/{MAX_DESC}
          </span>
        </label>
        <textarea
          rows={3}
          maxLength={MAX_DESC}
          className={`border border-border rounded-md p-2 text-sm outline-none focus:ring-1 ${errors?.metaDescription ? "focus:ring-red" : "focus:ring-main"
            } resize-none`}
          placeholder="Write a concise SEO description (max 160 chars)"
          value={formData.metaDescription || ""}
          onChange={(e) => onChange("metaDescription", e.target.value)}
        />
        {errors?.metaDescription && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red text-xs"
          >
            {errors.metaDescription.message}
          </motion.p>
        )}
        <p className="text-xs text-gray-500">
          Ideal length: 120–160 characters for better SEO visibility.
        </p>
      </div>

      {/* ===== Pro Tip ===== */}
      <div className="bg-main/5 border border-main/20 rounded-md p-3 text-sm text-gray-700">
        💡 <span className="font-medium">Pro Tip:</span> Keep meta title short,
        unique & keyword-focused. Meta description should summarize the product
        and encourage clicks from search results.
      </div>
    </div>
  );
};

export default StepMetaInfo;