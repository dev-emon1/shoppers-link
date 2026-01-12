// src/pages/admin/AddFeaturedProducts.jsx
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import API from "../../../utils/api";
import { Search, X, Sparkles, Tag, Palette, Clock } from "lucide-react";
import { useAuth } from "../../../utils/AuthContext";

const AddFeaturedProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Modal states
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [badgeText, setBadgeText] = useState("");
  const [badgeColor, setBadgeColor] = useState("#ef4444");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");

  const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products?per_page=200");
      const api = res.data.data;

      // Filter vendor products
      const vendorProducts = api.filter(
        (item) => item.vendor?.id === user.vendor.id
      );
      setProducts(vendorProducts);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);
  //   console.log(products);
  const openModal = (product) => {
    setSelectedProduct(product);
    setSelectedVariantId("");
    setBadgeText("");
    setBadgeColor("#ef4444");
    setStartsAt("");
    setEndsAt("");
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const payload = {
      product_id: selectedProduct.id,
      product_variant_id: selectedVariantId || null,
      badge_text: badgeText || null,
      badge_color: badgeColor,
      starts_at: startsAt || null,
      ends_at: endsAt || null,
    };
    // console.log(payload);

    try {
      await API.post("/featuredProducts", payload);
      toast.success("added to Featured!");
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="md:flex justify-between items-center mb-4">
          <div className="mb-2 md:mb-0">
            <h1 className="text-xl font-bold text-gray-800">
              Add to Featured Products
            </h1>
            <p className="text-gray-600 mt-1">
              Select any product and make it shine
            </p>
          </div>
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-4 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search product name, SKU..."
              className="w-full pl-10 py-2 border rounded-lg focus:outline-none focus:border-main"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {loading ? (
            [...Array(12)].map((_, i) => (
              <div
                key={i}
                className="bg-white/80 rounded-2xl h-64 animate-pulse shadow-lg"
              ></div>
            ))
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <p className="text-2xl text-gray-500">No products found</p>
            </div>
          ) : (
            filteredProducts.map((p) => {
              const img = p.images?.find((i) => i.is_primary)?.image_path;

              return (
                <motion.div
                  key={p.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openModal(p)}
                  className="group cursor-pointer"
                >
                  <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all">
                    <div className="aspect-square relative overflow-hidden bg-gray-100">
                      <img
                        src={`${IMAGE_URL}/${img}`}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                      <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition">
                        <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-sm font-bold text-main">
                          Click to Feature
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-sm line-clamp-2 min-h-10">
                        {p.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 min-h-4">SKU: {p.sku}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Beautiful Modal */}
      <AnimatePresence>
        {showModal && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="p-2 rounded-t-3xl">
                <div className="flex justify-between items-center border-b px-6 py-0">
                  <h2 className="text-xl font-bold flex items-center gap-3 ">
                    {/* <Sparkles size={28} /> */}
                    Make Featured
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="hover:bg-white/20 p-2 rounded-full transition"
                  >
                    <X size={28} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-4 space-y-2">
                {/* Product Preview */}
                <div className="rounded-2xl px-2 text-center">
                  <img
                    src={`${IMAGE_URL}/${selectedProduct.images?.find((i) => i.is_primary)
                      ?.image_path
                      }`}
                    alt={selectedProduct.name}
                    className="w-20 h-20 mx-auto rounded-2xl object-cover shadow-xl"
                  />
                  <h3 className="text-md font-bold mt-2">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-gray-600 text-sm">• SKU: {selectedProduct.sku}</p>
                </div>

                {/* Variant */}
                {selectedProduct.variants?.length > 0 && (
                  <div>
                    <label className="flex items-center gap-2 font-semibold mb-3 text-sm">
                      <Tag size={20} /> Select Variant (Optional)
                    </label>
                    <select
                      value={selectedVariantId}
                      onChange={(e) => setSelectedVariantId(e.target.value)}
                      className="w-full px-5 py-1 border-2 border-gray-200 rounded-xl focus:border-main outline-none text-sm"
                    >
                      <option value="">All Variants</option>
                      {selectedProduct.variants.map((v) => {
                        let label = v.sku;
                        try {
                          const attr = JSON.parse(v.attributes);
                          label = Object.values(attr).join(" • ");
                        } catch { }
                        return (
                          <option key={v.id} value={v.id}>
                            {label}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}

                {/* Badge */}
                <div className="space-y-4 text-sm">
                  <label className="flex items-center gap-2 font-semibold">
                    <Palette size={20} /> Badge Design
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="e.g. HOT, SALE, NEW"
                      value={badgeText}
                      onChange={(e) => setBadgeText(e.target.value)}
                      className="flex-1 px-5 border-2 rounded-xl focus:border-main outline-none text-sm p-1"
                    />
                    <input
                      type="color"
                      value={badgeColor}
                      onChange={(e) => setBadgeColor(e.target.value)}
                      className="w-24 h-9 rounded-2xl cursor-pointer shadow-lg"
                    />
                  </div>
                  {badgeText && (
                    <div className="rounded-2xl text-center">
                      <span
                        className="inline-block px-8 rounded-full text-white font-bold text-sm shadow-2xl"
                        style={{ backgroundColor: badgeColor }}
                      >
                        {badgeText}
                      </span>
                    </div>
                  )}
                </div>

                {/* Schedule */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <label className="flex items-center gap-2 font-semibold mb-3">
                      <Clock size={20} /> Start Time (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={startsAt}
                      onChange={(e) => setStartsAt(e.target.value)}
                      className="w-full px-5 py-1 border-2 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 font-semibold mb-3">
                      <Clock size={20} /> End Time (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={endsAt}
                      onChange={(e) => setEndsAt(e.target.value)}
                      className="w-full px-5 py-1 border-2 rounded-xl"
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="bg-main rounded-xl">
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-white text-transparent bg-clip-text bg-main font-bold p-1 rounded-xl hover:shadow-2xl transition text-sm"
                  >
                    Add to Featured
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddFeaturedProducts;
