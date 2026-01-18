// src/components/ui/ProductEditModal.jsx
import React, { useState, useEffect } from "react";
import { RiCloseLine } from "react-icons/ri";
import API from "../../utils/api";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// 1. Import Toastify
import { toast } from "react-toastify";

const ProductEditModal = ({ product, onClose, onSuccess }) => {
    const MAX_TITLE = 60;
    const MAX_DESC = 160;
    const MAX_SHORT = 300;
    const MAX_LONG = 2000;
    // console.log(product);

    // Form state - only the fields you want
    const [formData, setFormData] = useState({
        name: "",
        short_description: "",
        long_description: "",
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
        status: "",
    });
    // Local editor states for instant UI + debounced sync
    const [shortDesc, setShortDesc] = useState("");
    const [longDesc, setLongDesc] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(false);
    // Load product data
    useEffect(() => {
        if (product) {
            const {
                name = "",
                short_description = "",
                long_description = "",
                meta_title = "",
                meta_description = "",
                meta_keywords = "",
                status = "",
            } = product;

            setFormData({
                name,
                short_description,
                long_description,
                meta_title,
                meta_description,
                meta_keywords,
                status,
            });

            setShortDesc(short_description);
            setLongDesc(long_description);
        }
    }, [product]);

    // Auto-sync short & long description to formData (debounced)
    useEffect(() => {
        const timer = setTimeout(() => {
            setFormData((prev) => ({
                ...prev,
                short_description: shortDesc,
                long_description: longDesc,
            }));
            setIsSaving(true);
        }, 600);

        const hide = setTimeout(() => setIsSaving(false), 1600);

        return () => {
            clearTimeout(timer);
            clearTimeout(hide);
        };
    }, [shortDesc, longDesc]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await API.patch(`/products/${product.id}`, formData);
            // alert("Product updated successfully!");
            // 2. Use toast.success instead of alert
            toast.success("Product updated successfully!", {
                position: "top-right",
                autoClose: 3000,
            });
            onSuccess?.();
            onClose();
        } catch (err) {
            console.error(err);
            // alert(err.response?.data?.message || "Failed to update product");
            // 3. Use toast.error for failures
            const errorMsg = err.response?.data?.message || "Failed to update product";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (!product) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[90] animate-fadeIn">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-[95%] p-3 relative overflow-auto max-h-[90vh] mx-auto">
                <div className="px-2">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-bold">Edit Product</h2>
                        <button onClick={onClose} className="text-main hover:text-mainHover fixed left-auto right-4 top-8">
                            <RiCloseLine size={28} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-md px-3 py-2"
                            />
                        </div>
                        <div className="bg-white border border-border rounded-md p-2 shadow-sm">
                            <h4 className="font-medium mb-2">Short Description</h4>
                            <textarea
                                value={shortDesc}
                                onChange={(e) => e.target.value.length <= MAX_SHORT && setShortDesc(e.target.value)}
                                maxLength={MAX_SHORT}
                                placeholder="e.g. Lightweight running shoes with breathable mesh and flexible sole."
                                className="w-full min-h-[100px] border border-border rounded-md p-3 outline-none focus:ring-2 focus:ring-main resize-none text-sm bg-white"
                            />
                            <span className={`text-sm ${shortDesc.length > MAX_SHORT ? "text-red-600" : "text-gray-500"}`}>
                                {shortDesc.length}/{MAX_SHORT}
                            </span>
                        </div>
                        <div className="bg-white border border-border rounded-md shadow-sm">

                            <div className="p-4">
                                <h4 className="font-medium mb-2">Long Description</h4>
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
                                <span className="text-sm text-gray-500">{longDesc.length.toLocaleString()} chars</span>
                            </div>

                            {/* Auto-save indicator */}
                            <div className="flex items-center justify-end px-4 pb-2">
                                <p
                                    className={`text-xs font-medium transition-all ${isSaving ? "text-main" : "text-green-600"
                                        }`}
                                >
                                    {isSaving ? "💾 Saving draft..." : "✅ All changes saved"}
                                </p>
                            </div>
                        </div>
                        {/* ===== Meta Title & Keywords ===== */}
                        <div className="grid md:grid-cols-2 gap-5">
                            {/* Meta Title */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700 flex justify-between items-center">
                                    <span>Meta Title</span>
                                </label>
                                <input
                                    type="text"
                                    maxLength={MAX_TITLE}
                                    className={`border border-border rounded-md p-2 text-sm outline-none "focus:ring-red" : "focus:ring-main"
                                        }`}
                                    placeholder="Enter SEO title (max 60 chars)"
                                    name="meta_title"
                                    value={formData.meta_title}
                                    onChange={handleChange}
                                />

                                <span className={`text-xs ${formData.meta_title.length > MAX_TITLE ? "text-red-600" : "text-gray-500"}`}>
                                    {formData.meta_title.length}/{MAX_TITLE}
                                </span>
                            </div>

                            {/* Meta Keywords */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Meta Keywords
                                </label>
                                <input
                                    type="text"
                                    className={`border border-border rounded-md p-2 text-sm outline-none "focus:ring-red" : "focus:ring-main"
                                        }`}
                                    placeholder="Enter keywords (comma separated)"
                                    name="meta_keywords"
                                    value={formData.meta_keywords}
                                    onChange={handleChange}
                                />
                                <p className="text-xs text-gray-500">
                                    e.g. shoes, running, sportswear
                                </p>
                            </div>
                        </div>
                        {/* ===== Meta Description ===== */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700 flex justify-between items-center">
                                <span>Meta Description</span>
                            </label>
                            <textarea
                                className={`border border-border rounded-md p-2 text-sm outline-none focus:ring-1 focus:ring-main`}
                                placeholder="Write a concise SEO description (max 160 chars)"
                                name="meta_description"
                                value={formData.meta_description}
                                onChange={handleChange}
                                rows={4}
                                maxLength={MAX_DESC}
                            />
                            <div className="flex justify-between">
                                <p className="text-xs text-gray-500">
                                    Ideal length: 120–160 characters for better SEO visibility.
                                </p>

                                <span className={`text-sm ${formData.meta_description.length > MAX_DESC ? "text-red-600" : "text-gray-500"}`}>
                                    {formData.meta_description.length}/{MAX_DESC}
                                </span>
                            </div>
                        </div>
                        <div className="sm:flex justify-between items-center">
                            <div className="flex gap-2">
                                <input type="checkbox"
                                    id="status-checkbox"
                                    // Checkbox is checked if status is 'active'
                                    checked={formData.status === 1}
                                    onChange={(e) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            status: e.target.checked ? 1 : 0
                                        }));
                                    }} />
                                <label htmlFor="">Is Active</label>
                            </div>
                            <div className="flex justify-end gap-2 border-t">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-3 py-1 border rounded-md hover:bg-gray-50 bg-red text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-3 py-1 bg-main text-white rounded-md hover:bg-mainHover disabled:opacity-70"
                                >
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div >
        </div >
    );
};

export default ProductEditModal;