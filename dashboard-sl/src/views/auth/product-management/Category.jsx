import React, { useState, useMemo, useCallback, useEffect } from "react";
import Table from "../../../components/table/Table";
import StatusBadge from "../../../components/common/StatusBadge";
import TableActions from "../../../components/table/TableActions";
import SlidePanel from "../../../components/common/SlidePanel";
import ImageUploader from "../../../components/common/ImageUploader";
import PageHeader from "../../../components/common/PageHeader";
import Pagination from "../../../components/Pagination";
import axios from "axios";
import FilterBar from "../../../components/common/FilterBar";

const API_URL = "http://127.0.0.1:8000/api/categories";
const IMAGE_URL = "http://127.0.0.1:8000/storage/";

const Category = React.memo(() => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryDetails, setCategoryDetails] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null); // ✅ Track current category being edited

  // ===== Fetch Categories =====
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setCategories(res.data.data || res.data);
    } catch (error) {
      console.error("❌ Failed to fetch categories", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  // ===== Add/Edit Submit =====
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!categoryName.trim()) {
        alert("⚠️ Category name is required!");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("name", categoryName.trim());
        formData.append("description", categoryDetails || "");
        formData.append("status", "active");

        if (imageFile) {
          formData.append("image", imageFile);
        }

        let res;
        if (editingCategory) {
          // 🟡 Update existing category
          res = await axios.post(
            `${API_URL}/${editingCategory.id}?_method=PUT`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
        } else {
          // 🟢 Create new category
          res = await axios.post(API_URL, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }

        const { success, message, data } = res.data;

        if (success) {
          if (editingCategory) {
            // Replace updated category
            setCategories((prev) =>
              prev.map((cat) => (cat.id === data.id ? data : cat))
            );
            alert("✅ Category updated successfully!");
          } else {
            setCategories((prev) => [data, ...prev]);
            alert("✅ Category added successfully!");
          }

          // Reset form
          setCategoryName("");
          setCategoryDetails("");
          setImageFile(null);
          setImagePreview(null);
          setEditingCategory(null);
          setShow(false);
        } else {
          alert("⚠️ Something went wrong!");
        }
      } catch (error) {
        console.error("❌ Error:", error.response?.data || error.message);

        if (error.response?.status === 422) {
          const errors = error.response.data.errors;
          const firstError = errors
            ? Object.values(errors)[0][0]
            : "Validation failed!";
          alert("⚠️ " + firstError);
        } else {
          alert("⚠️ " + (error.response?.data?.message || "Server error!"));
        }
      }
    },
    [categoryName, categoryDetails, imageFile, editingCategory]
  );

  // ===== Edit Click =====
  const handleEdit = useCallback((category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategoryDetails(category.description || "");
    setImagePreview(
      category.image?.startsWith("http")
        ? category.image
        : `${IMAGE_URL}${category.image}`
    );
    setShow(true);
  }, []);

  // ===== Delete Category =====
  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm("🗑️ Are you sure you want to delete this category?"))
        return;

      try {
        const res = await axios.delete(`${API_URL}/${id}`);
        if (res.data.success) {
          setCategories((prev) => prev.filter((cat) => cat.id !== id));
          alert("✅ Category deleted successfully!");
        }
      } catch (error) {
        console.error("❌ Delete failed:", error);
        alert("⚠️ Failed to delete category!");
      }
    },
    []
  );
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
  const columns = [
    {
      key: "no",
      label: "No",
      render: (item, i, page, perPage) => (page - 1) * perPage + i + 1,
      className: "text-center w-[50px]",
    },
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
              : "/no-image.png"
          }
          alt={item.name}
          className="w-10 h-10 rounded object-cover border border-border"
        />
      ),
    },
    {
      key: "name",
      label: "Name",
      className: "font-medium text-gray-800 capitalize",
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-center",
      render: (item) => (
        <TableActions
          onEdit={() => handleEdit(item)}
          onDelete={() => handleDelete(item.id)}
        />
      ),
    },
  ];

  // ===== Pagination + Search =====
  const { currentData, totalPages } = useMemo(() => {
    const filtered = categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const total = Math.ceil(filtered.length / perPage);
    const start = (page - 1) * perPage;
    return { currentData: filtered.slice(start, start + perPage), totalPages: total };
  }, [categories, searchTerm, perPage, page]);

  return (
    <div className="px-4">
      {/* ===== Header ===== */}
      <PageHeader
        title="Categories"
        searchTerm={searchTerm}
        onSearch={handleSearch}
        perPage={perPage}
        onPerPageChange={(e) => setPerPage(Number(e.target.value))}
        onAddClick={() => {
          setEditingCategory(null);
          setShow(true);
          setCategoryName("");
          setCategoryDetails("");
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
      {/* ===== Table Section ===== */}
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
                onPageChange={setPage}
              />
            </div>
          </div>
        </div>

        {/* ===== Slide Panel: Add/Edit Category ===== */}
        <SlidePanel
          show={show}
          title={editingCategory ? "Edit Category" : "Add New Category"}
          onClose={() => setShow(false)}
        >
          <form onSubmit={handleSubmit}>
            {/* Category Name */}
            <div className="flex flex-col w-full gap-1 mb-5">
              <label className="text-sm font-medium mb-1">
                Category Name <span className="text-red">*</span>
              </label>
              <input
                type="text"
                className="px-3 py-2 border border-border rounded-md outline-none focus:ring-1 focus:ring-main text-sm"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="flex flex-col w-full gap-1 mb-5">
              <label className="text-sm font-medium mb-1">Description</label>
              <textarea
                className="px-3 py-2 border border-border rounded-md outline-none focus:ring-1 focus:ring-main text-sm resize-none"
                placeholder="Enter category description"
                value={categoryDetails}
                onChange={(e) => setCategoryDetails(e.target.value)}
                rows={3}
              />
            </div>

            {/* Image Upload */}
            <div className="max-w-md mx-auto mt-6">
              <label className="text-sm font-medium mb-1">
                Category Image {editingCategory ? "(optional)" : <span className="text-red">*</span>}
              </label>
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
            <div className="mt-8">
              <button
                type="submit"
                className="w-full rounded-md px-7 py-2 text-white text-sm font-medium bg-main hover:bg-mainHover"
              >
                {editingCategory ? "Update Category" : "Add Category"}
              </button>
            </div>
          </form>
        </SlidePanel>
      </div>
    </div>
  );
});

export default Category;
