import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Link2, X, Upload } from "lucide-react";
import API, { IMAGE_URL } from "../../../utils/api";
import { format } from "date-fns";

const BannersPage = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    console.log(banners);

    const [imagePreview, setImagePreview] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    // 1. Matched fields to Migration (button_text, button_link, position)
    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        description: "",
        button_text: "",
        button_link: "",
        position: "homepage",
        is_active: true,
        image_url: null,
    });

    const fetchBanners = async () => {
        try {
            const res = await API.get("/probanners"); // Fixed Endpoint
            setBanners(res.data.data || []);
        } catch (err) {
            console.error("Failed to load banners");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBanners(); }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        // console.log(data);
        // Validation: Only require file if creating a NEW banner
        if (!selectedFile && !editingId) {
            alert("Please select an image first.");
            return;
        }
        // 2. Map data to match database column names
        data.append("title", formData.title);
        data.append("subtitle", formData.subtitle || "");
        data.append("description", formData.description || "");
        data.append("button_text", formData.button_text || "");
        data.append("button_link", formData.button_link || "");
        data.append("position", formData.position);
        data.append("is_active", formData.is_active ? 1 : 0);

        if (selectedFile) {
            data.append("image_path", selectedFile); // Matched migration
        }

        try {
            if (editingId) {
                data.append("_method", "PUT");
                // 3. Fixed endpoint to match Route: /probanner/{banner}
                await API.post(`/probanner/${editingId}`, data);
            } else {
                await API.post("/probanners", data);
            }

            alert(editingId ? "Banner updated!" : "Banner created!");
            closeModal();
            fetchBanners();
        } catch (err) {
            alert("Error: " + (err.response?.data?.message || "Operation failed"));
        }
    };

    const handleEdit = (banner) => {
        setFormData({
            title: banner.title || "",
            subtitle: banner.subtitle || "",
            description: banner.description || "",
            button_text: banner.button_text || "",
            button_link: banner.button_link || "",
            position: banner.position || "homepage",
            is_active: !!banner.is_active,
        });
        // If banner.image_path exists, show the existing image from server
        if (banner.image_path) {
            setImagePreview(`${IMAGE_URL}${banner.image_path}`);
        } else {
            setImagePreview("");
        }

        setEditingId(banner.id);
        setShowForm(true);
    };

    const toggleActive = async (banner) => {
        try {
            // This matches your Route: /probanner/{id}/status
            const res = await API.patch(`/probanner/${banner.id}/status`);

            // Update local state instead of refetching everything for better performance
            setBanners(prevBanners =>
                prevBanners.map(b => b.id === banner.id ? res.data.data : b)
            );
        } catch (err) {
            alert("Status update failed");
        }
    };
    const closeModal = () => {
        setShowForm(false);
        setEditingId(null);
        setSelectedFile(null);
        setImagePreview("");
        setFormData({
            title: "", subtitle: "", description: "",
            button_text: "", button_link: "", position: "homepage", is_active: true,
        });
    };

    return (
        <div className="px-6 max-w-7xl mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-gray-800">Promotion Banners</h1>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-main text-white px-2 py-1 rounded-lg hover:bg-mainHover transition">
                    <Plus size={18} /> Add Banner
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 mt-10">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
                            <h2 className="text-xl font-bold">{editingId ? "Edit Banner" : "New Banner"}</h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Title</label>
                                    <input required type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Subtitle</label>
                                    <input type="text" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Position</label>
                                <select value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} className="w-full border rounded-lg px-3 py-2">
                                    <option value="homepage">Homepage Main</option>
                                    <option value="sidebar">Sidebar</option>
                                    <option value="popup">Popup</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Image Upload</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                                    {imagePreview ? (
                                        <div className="relative inline-block">
                                            <img
                                                src={imagePreview}
                                                className="mx-auto max-h-40 rounded shadow object-cover"
                                                alt="Preview"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImagePreview("");
                                                    setSelectedFile(null);
                                                }}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                            {/* Allow clicking the image to change it */}
                                            <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity rounded">
                                                <span className="text-white text-xs font-bold bg-black/40 px-2 py-1 rounded">Change</span>
                                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                            </label>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer block py-4">
                                            <Upload className="mx-auto text-gray-400 mb-2" />
                                            <span className="text-sm text-gray-500">Click to upload banner</span>
                                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                        </label>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Button Text</label>
                                    <input type="text" value={formData.button_text} onChange={(e) => setFormData({ ...formData, button_text: e.target.value })} className="w-full border rounded-lg px-3 py-2" placeholder="e.g. Shop Now" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Button Link</label>
                                    <input type="text" value={formData.button_link} onChange={(e) => setFormData({ ...formData, button_link: e.target.value })} className="w-full border rounded-lg px-3 py-2" placeholder="/products" />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={closeModal} className="px-4 py-2 border rounded-lg text-gray-600">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-main text-white rounded-lg hover:bg-mainHover">Save Banner</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners.map((banner) => (
                    <div key={banner.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden ${!banner.is_active && 'opacity-60'}`}>
                        <div className="h-40 bg-gray-100 relative">
                            {/* <img src={`${import.meta.env.VITE_IMAGE_URL}/${banner.image_path}`} className="w-full h-full object-cover" alt={banner.title} /> */}
                            <img src={banner.image_path ? `${IMAGE_URL}${banner.image_path}` : '/placeholder.jpg'} className="w-full h-full object-cover" alt={banner.title} />
                            {/* Inactive Overlay Badge */}
                            {!banner.is_active && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                        Inactive
                                    </span>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="absolute top-2 right-2 flex gap-2">
                                <button onClick={() => handleEdit(banner)} className="p-2 bg-white/90 rounded-full shadow hover:text-main">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => toggleActive(banner)} className={`p-2 bg-white/90 rounded-full shadow ${banner.is_active ? 'hover:text-green-600' : 'text-red-500 hover:text-red-700'
                                    }`}>
                                    {banner.is_active ? <ToggleRight /> : <ToggleLeft />}
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-gray-800">{banner.title}</h3>
                                <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded uppercase font-bold">{banner.position}</span>
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-3">{banner.subtitle}</p>
                            <div className="text-[10px] text-gray-400">Created: {format(new Date(banner.created_at), 'PPP')}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BannersPage;