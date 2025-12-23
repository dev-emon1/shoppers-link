/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { FileText } from "lucide-react";
import { motion } from "framer-motion";
import Heading from "../../../../components/common/Heading";

const StepDescription = ({ formData, onChange, errors }) => {
  const [shortDesc, setShortDesc] = useState(formData.shortDesc || "");
  const [longDesc, setLongDesc] = useState(formData.longDesc || "");
  const [isSaving, setIsSaving] = useState(false);

  const MAX_SHORT = 255;
  const MAX_LONG = 2000; // standard long description limit

  // === Auto-sync short description ===
  useEffect(() => {
    const t = setTimeout(() => onChange("shortDesc", shortDesc), 300);
    return () => clearTimeout(t);
  }, [shortDesc]);

  // === Auto-sync long description with debounce ===
  useEffect(() => {
    const t = setTimeout(() => onChange("longDesc", longDesc), 400);
    return () => clearTimeout(t);
  }, [longDesc]);

  // === Auto-saving animation simulation ===
  useEffect(() => {
    if (!shortDesc && !longDesc) return;
    setIsSaving(true);
    const timer = setTimeout(() => setIsSaving(false), 1000);
    return () => clearTimeout(timer);
  }, [shortDesc, longDesc]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ===== Header ===== */}
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-5 h-5 text-main" />
        <h2 className="text-lg font-semibold text-gray-800">
          Product Description
        </h2>
      </div>

      {/* ===== Short Description ===== */}
      <div className="bg-white border border-border rounded-md p-4 shadow-sm">
        <h4 className="font-medium mb-2">Short Description</h4>
        <p className="text-sm text-gray-500 mb-3">
          Summarize your product in 2–3 short lines (max {MAX_SHORT}{" "}
          characters).
        </p>

        <textarea
          value={shortDesc}
          onChange={(e) =>
            e.target.value.length <= MAX_SHORT && setShortDesc(e.target.value)
          }
          maxLength={MAX_SHORT}
          placeholder="e.g. Lightweight running shoes with breathable mesh and flexible sole."
          className="w-full min-h-[100px] border border-border rounded-md p-3 outline-none focus:ring-2 focus:ring-main resize-none text-sm bg-white"
        />

        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>
            {shortDesc.length}/{MAX_SHORT} characters
          </span>
          {errors?.shortDesc && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red"
            >
              {errors.shortDesc.message}
            </motion.span>
          )}
        </div>
      </div>

      {/* ===== Long Description ===== */}
      <div className="bg-white border border-border rounded-md shadow-sm">
        <div className="bg-gray-50 border-b border-border p-3 flex items-center justify-between">
          <Heading title={"Detailed Product Description"} />
          <span className="text-xs text-gray-500">
            Add detailed info (features, materials, warranty, usage)
          </span>
        </div>

        <div className="p-4 ck-editor-wrapper">
          <CKEditor
            editor={ClassicEditor}
            data={longDesc}
            config={{
              placeholder:
                "Write detailed product information (features, materials, usage, warranty, benefits, etc.)...",
              toolbar: {
                items: [
                  "heading",
                  "|",
                  "bold",
                  "italic",
                  "link",
                  "bulletedList",
                  "numberedList",
                  "|",
                  "blockQuote",
                  "insertTable",
                  "|",
                  "undo",
                  "redo",
                ],
                shouldNotGroupWhenFull: true,
              },
              table: {
                contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
              },
            }}
            onChange={(_, editor) => {
              const data = editor.getData();
              if (data.length <= MAX_LONG) setLongDesc(data);
            }}
          />
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            <span>
              {longDesc.length}/{MAX_LONG} characters
            </span>
            {errors?.longDesc && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red"
              >
                {errors.longDesc.message}
              </motion.span>
            )}
          </div>
        </div>

        {/* Auto-save indicator */}
        <div className="flex items-center justify-end px-4 pb-2">
          <p
            className={`text-xs font-medium transition-all ${
              isSaving ? "text-main" : "text-green-600"
            }`}
          >
            {isSaving ? "💾 Saving draft..." : "✅ All changes saved"}
          </p>
        </div>
      </div>

      {/* ===== Pro Tip ===== */}
      <div className="bg-main/5 border border-main/20 rounded-md p-3 text-sm text-gray-700">
        💡 <span className="font-medium">Pro Tip:</span> Write natural,
        SEO-friendly descriptions. Mention features, materials, usage, and brand
        details to boost conversions.
      </div>
    </div>
  );
};

export default StepDescription;
