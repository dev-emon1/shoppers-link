import React, { useState, useEffect, useCallback, useMemo } from "react";
import PageHeader from "../../../components/common/PageHeader";
import Table from "../../../components/table/Table";
import TableActions from "../../../components/table/TableActions";
import SlidePanel from "../../../components/common/SlidePanel";
import ImageUploader from "../../../components/common/ImageUploader";
import Pagination from "../../../components/Pagination";
import axios from "axios";
import FilterBar from "../../../components/common/FilterBar";
import API, { IMAGE_URL } from "../../../utils/api";

const Subcategory = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  // console.log(categories);

  const [editingSubcategory, setEditingSubcategory] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [subCategoryDetails, setSubCategoryDetails] = useState("");
  const [status, setStatus] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // ===== Fetch Categories =====
  const fetchCategories = useCallback(async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data.data || res.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  }, []);

  // ===== Fetch Subcategories =====
  const fetchSubcategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/subCategories");
      setSubcategories(res.data.data || res.data);
    } catch (error) {
      console.error("❌ Failed to fetch sub categories", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, [fetchCategories, fetchSubcategories]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategory) return alert("⚠️ Please select a category!");
    if (!subCategoryName.trim()) return alert("⚠️ Subcategory name is required!");

    try {
      const formData = new FormData();
      formData.append("category_id", selectedCategory);
      formData.append("name", subCategoryName.trim());
      formData.append("description", subCategoryDetails || "");
      formData.append("status", status);
      if (imageFile) formData.append("image", imageFile);

      // for (let [key, value] of formData.entries()) {
      //   console.log("FormData:", key, value);
      // }
      let res;

      if (editingSubcategory) {
        // Update
        res = await API.post(`subCategories/${editingSubcategory.id}?_method=PUT`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Create
        res = await API.post("subCategories", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      // console.log("Response:", res.data);
      const { success, data, message } = res.data;
      if (success) {
        alert(message || "Subcategory saved successfully!");
        setShow(false);
        setEditingSubcategory(null);
        setSelectedCategory("");
        setSubCategoryName("");
        setSubCategoryDetails("");
        setStatus("");
        setImageFile(null);
        fetchSubcategories();
        setImagePreview(null);
      } else {
        alert(message || "Something went wrong!");
      }
    } catch (err) {
      console.error("Error saving subcategory:", err.response?.data || err);
      const errors = err.response?.data?.errors;
      if (errors) {
        alert(Object.values(errors)[0][0]);
      } else {
        alert(err.response?.data?.message || "Server error!");
      }
    }
  };

  // ===== Edit Subcategory =====
  const handleEdit = (sub) => {
    setEditingSubcategory(sub);
    setSelectedCategory(sub.category_id);
    setSubCategoryName(sub.name);
    setSubCategoryDetails(sub.description || "");
    setStatus(sub.status || 0);
    setImagePreview(
      sub.image?.startsWith("http")
        ? sub.image
        : `${IMAGE_URL}${sub.image}`
    );
    setShow(true);
  };
  // ==== Handlers ====
  const handleFileSelect = useCallback((file) => {
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  }, []);
  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  }, []);
  const handlePerPageChange = useCallback((e) => {
    setPerPage(Number(e.target.value));
    setPage(1);
  }, []);
  // ===== Table Columns =====
  // console.log(subcategories);
  // ===== Toggle Status =====
  const handleToggleStatus = useCallback(async (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;

    // Optimistic Update: Update subcategories UI immediately
    setSubcategories((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, status: newStatus } : sub))
    );

    try {
      // Note: Make sure the URL matches your Laravel route (usually camelCase or kebab-case)
      const res = await API.post(`subCategories/${id}/toggle-status`, {
        status: newStatus,
        _method: 'PATCH'
      });

      if (!res.data.success) {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("❌ Status update failed:", error);

      // Rollback: Revert the UI if the API call fails
      setSubcategories((prev) =>
        prev.map((sub) => (sub.id === id ? { ...sub, status: currentStatus } : sub))
      );

      alert("⚠️ Failed to update status on server.");
    }
  }, []);
  const columns = [
    { key: "no", label: "No", render: (item, i) => (page - 1) * perPage + i + 1 },
    {
      key: "image",
      label: "Image",
      render: (item) => (
        <img
          src={
            item.image
              ? item.image.startsWith("http")
                ? item.image
                : `${IMAGE_URL}${item.image}`
              : `/images/default.jpg`
          }
          alt={item.name}
          className="w-10 h-10 rounded object-cover border border-border"
        />
      ),
    },
    { key: "name", label: "Subcategory", sortable: true },
    { key: "category", label: "Category", render: (item) => item.category.name },
    {
      key: "status",
      label: "Status",
      className: "text-center w-[100px]",
      render: (item) => (
        <div className="flex justify-center">
          <button
            onClick={() => handleToggleStatus(item.id, item.status)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${item.status === 1 ? "bg-green" : "bg-gray-300"
              }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${item.status === 1 ? "translate-x-6" : "translate-x-1"
                }`}
            />
          </button>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (item) => <TableActions onEdit={() => handleEdit(item)} />,
    },
  ];
  // ===== Pagination + Search =====
  const { currentData, totalPages } = useMemo(() => {
    const filtered = subcategories.filter((cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const total = Math.ceil(filtered.length / perPage);
    const start = (page - 1) * perPage;
    return { currentData: filtered.slice(start, start + perPage), totalPages: total };
  }, [subcategories, searchTerm, perPage, page]);
  return (
    <div className="px-4">
      <PageHeader
        title="Subcategories"
        searchTerm={searchTerm}
        onSearch={handleSearch}
        perPage={perPage}
        onPerPageChange={handlePerPageChange}
        addLabel="Add Sub Category"
        onAddClick={() => {
          setEditingSubcategory(null);
          setShow(true);
          setSelectedCategory("");
          setSubCategoryName("");
          setSubCategoryDetails("");
          setImageFile(null);
          setImagePreview(null);
        }}
      />
      {/* ===== Filter Bar ===== */}
      <div className="mb-4 bg-white p-3 rounded-md shadow-sm">
        <FilterBar
          perPage={perPage}
          onPerPageChange={handlePerPageChange}
        />
      </div>
      <div className="flex flex-wrap w-full">
        <div className="w-full lg:w-7/12">
          <div className="bg-white p-4 rounded-md shadow-md overflow-x-auto">
            <Table
              columns={columns}
              data={currentData}
              page={page}
              perPage={perPage}
              enableCheckbox={true}
              showFooter={true}
              loading={loading}
            />
            <div className="flex justify-end mt-4">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage} />
            </div>
          </div>
        </div>

        <SlidePanel show={show} title={editingSubcategory ? "Edit Subcategory" : "Add Subcategory"} onClose={() => setShow(false)}>
          <form onSubmit={handleSubmit}>
            {/* Category Select */}
            <div className="flex flex-col w-full gap-1 mb-5">
              <label className="text-sm font-medium">Select Category <span className="text-red">*</span></label>
              <select className="px-2 py-2 border rounded-md" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="">-- Choose Category --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Subcategory Name */}
            <div className="flex flex-col w-full gap-1 mb-5">
              <label className="text-sm font-medium">Subcategory Name <span className="text-red">*</span></label>
              <input type="text" className="px-2 py-2 border rounded-md" value={subCategoryName} onChange={(e) => setSubCategoryName(e.target.value)} />
            </div>

            {/* Description */}
            <div className="flex flex-col w-full gap-1 mb-5">
              <label className="text-sm font-medium">Description (optional)</label>
              <textarea className="px-2 py-2 border rounded-md" value={subCategoryDetails} onChange={(e) => setSubCategoryDetails(e.target.value)} rows={3} />
            </div>
            {/* Status */}
            {/* <div className="flex flex-col w-full gap-1 mb-5">
              <label className="text-sm font-medium">Select Status</label>
              <select className="px-2 py-2 border rounded-md" value={status} onChange={(e) => setStatus(Number(e.target.value))}>
                <option value="">-- Choose Status --</option>
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div> */}
            {/* Image Upload */}
            <div className="flex flex-col w-full gap-1 mb-5">
              <label className="text-sm font-medium">Image (optional)</label>
              <ImageUploader onFileSelect={handleFileSelect} multiple={false} />
              {imagePreview && (
                <div className="mt-3 flex justify-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded border border-gray-300"
                  />
                </div>
              )}
            </div>

            {/* Submit */}
            <button type="submit" className="w-full bg-main text-white py-2 rounded-md">
              {editingSubcategory ? "Update Subcategory" : "Add Subcategory"}
            </button>
          </form>
        </SlidePanel>
      </div>
    </div>
  );
};

export default Subcategory;
