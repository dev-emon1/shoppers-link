// src/pages/admin/banners/BannersPage.jsx
import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Image,
  Link2,
  X,
  Upload,
} from "lucide-react";
import API from "../../../utils/api";
import { format } from "date-fns";

const SliderPage = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [imagePreview, setImagePreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cta_text: "",
    cta_link: "",
    is_active: true,
  });
  // console.log(banners);

  const fetchBanners = async () => {
    try {
      const res = await API.get("/active/banners");
      setBanners(res.data.data || []);
    } catch (err) {
      // alert("Failed to load banners");
      console.log("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);
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
    data.append("title", formData.title);
    data.append("description", formData.description || "");
    data.append("cta_text", formData.cta_text || "");
    data.append("cta_link", formData.cta_link || "");
    data.append("is_active", formData.is_active ? 1 : 0);

    if (selectedFile) {
      data.append("image", selectedFile);
    } else if (!editingId) {
      alert("Please select an image");
      return;
    }

    console.log(data);
    try {
      if (editingId) {
        data.append("_method", "PUT"); // ← THIS FIXES THE EMPTY LOG
        await API.post(`/banners/${editingId}`, data);
      } else {
        await API.post("/banners", data);
      }

      alert(editingId ? "Banner updated!" : "Banner created!");
      closeModal();
      fetchBanners();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Upload failed"));
    }
  };

  const handleEdit = (banner) => {
    setFormData({
      title: banner.title,
      description: banner.description || "",
      cta_text: banner.cta_text || "",
      cta_link: banner.cta_link || "",
      is_active: banner.is_active,
    });
    setImagePreview(`${import.meta.env.VITE_IMAGE_URL}/${banner.image}`);
    setSelectedFile(null);
    setEditingId(banner.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this banner?")) return;
    try {
      await API.delete(`/banners/${id}`);
      fetchBanners();
      alert("Banner deleted");
    } catch (err) {
      alert("Delete failed");
    }
  };

  const toggleActive = async (banner) => {
    try {
      await API.post(`/banner/${banner.id}/status`, {
        is_active: !banner.is_active,
      });
      fetchBanners();
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
      title: "",
      description: "",
      cta_text: "",
      cta_link: "",
      is_active: true,
    });
  };
  return (
    <div className="px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">Slider Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-main text-white px-2 py-2 rounded-lg hover:bg-mainHover transition text-sm"
        >
          <Plus size={20} /> Add New Slider
        </button>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn mt-10">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-[95%] p-5 relative overflow-auto max-h-[90vh]">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {editingId ? "Edit Banner" : "Create New Banner"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-2">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Summer Mega Sale 70% Off"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Limited time offer..."
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Banner Image <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-2 text-center hover:border-blue-400 transition">
                  {imagePreview ? (
                    <div className="space-y-1">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto max-h-48 rounded-lg shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview("");
                          setSelectedFile(null);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="mx-auto text-gray-400" size={48} />
                      <p className="text-gray-600">
                        Drop image here or click to browse
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-main file:text-white hover:file:bg-mainHover"
                        required={!editingId}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* CTA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.cta_text}
                    onChange={(e) =>
                      setFormData({ ...formData, cta_text: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Shop Now"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    CTA Link
                  </label>
                  <input
                    type="url"
                    value={formData.cta_link}
                    onChange={(e) =>
                      setFormData({ ...formData, cta_link: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="https://yoursite.com/sale"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="w-4 h-4 text-main rounded focus:ring-blue-500"
                />
                <label htmlFor="active" className="text-sm font-medium">
                  Active (Visible on homepage)
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 pt-2 border-t text-sm">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 bg-main text-white rounded-lg hover:bg-mainHover transition font-medium"
                >
                  {editingId ? "Update Slider" : "Create Slider"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Banners Grid */}
      {loading ? (
        <div className="text-center py-32 text-gray-500 text-xl">
          Loading slider...
        </div>
      ) : banners.length === 0 ? (
        <div className="text-center py-32 bg-gray-50 rounded-xl">
          <p className="text-xl text-gray-600 mb-4">No Slider yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-main text-white px-4 py-2 rounded-lg hover:bg-mainHover"
          >
            Create Your First Slider
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className={`group relative bg-white rounded-2xl shadow-xl overflow-hidden border-4 transition-all ${
                banner.is_active
                  ? "border-green-400"
                  : "border-gray-300 opacity-80"
              }`}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={`${import.meta.env.VITE_IMAGE_URL}/${banner.image}`}
                  alt={banner.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {!banner.is_active && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <span className="text-white text-3xl font-bold">
                      INACTIVE
                    </span>
                  </div>
                )}
              </div>

              <div className="p-2">
                <h3 className="text-md font-bold text-gray-800 mb-2">
                  {banner.title}
                </h3>
                {banner.description && (
                  <p className="text-gray-600 text-sm">{banner.description}</p>
                )}

                {banner.cta_text && (
                  <a
                    href={banner.cta_link || "#"}
                    className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-main text-white rounded-xl hover:from-mainHover hover:to-purple-700 transition font-medium text-xs"
                  >
                    {banner.cta_text} <Link2 size={18} />
                  </a>
                )}

                <div className="flex justify-between items-center mt-4">
                  <span
                    className={`px-4 py-2 rounded-full text-xs font-bold ${
                      banner.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {banner.is_active ? "ACTIVE" : "INACTIVE"}
                  </span>

                  <div className="flex gap-3">
                    <button
                      onClick={() => toggleActive(banner)}
                      className="p-3 bg-blue-100 text-main rounded-xl hover:bg-blue-200 transition"
                      title="Toggle status"
                    >
                      {banner.is_active ? (
                        <ToggleRight size={18} />
                      ) : (
                        <ToggleLeft size={18} />
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(banner)}
                      className="p-3 bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-500 mt-4">
                  Created:{" "}
                  {format(
                    new Date(banner.created_at),
                    "dd MMM yyyy 'at' hh:mm a"
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SliderPage;
