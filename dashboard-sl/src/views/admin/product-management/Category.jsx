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
import API, { IMAGE_URL } from "../../../utils/api";

const Category = React.memo(() => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryDetails, setCategoryDetails] = useState("");
  const [status, setStatus] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  // ✅ Track current category being edited
  // ===== Fetch Categories =====
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/categories");
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
        formData.append("status", status);

        if (imageFile) {
          formData.append("image", imageFile);
        }

        let res;

        if (editingCategory) {
          // Update
          res = await API.post(
            `categories/${editingCategory.id}?_method=PUT`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
        } else {
          // Create
          res = await API.post("categories", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }

        const response = res.data;
        const data = response.data;

        if (response.success) {
          if (editingCategory) {
            setCategories((prev) =>
              prev.map((cat) => (cat.id === data.id ? data : cat))
            );
            alert("✅ Category updated successfully!");
          } else {
            setCategories((prev) => [data, ...prev]);
            alert("✅ Category added successfully!");
          }

          // Reset everything
          setCategoryName("");
          setCategoryDetails("");
          setStatus(1);
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
    [categoryName, categoryDetails, status, imageFile, editingCategory]
  );


  // ===== Edit Click =====
  const handleEdit = useCallback((category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategoryDetails(category.description || "");
    setStatus(category.status || 0);
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

  // ===== Toggle Status =====
  const handleToggleStatus = useCallback(async (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;

    // Optimistic Update: Update UI first for a snappy feel
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, status: newStatus } : cat))
    );

    try {
      const res = await API.post(`categories/${id}/toggle-status`, {
        status: newStatus,
        _method: 'PATCH' // Many Laravel APIs use POST with _method for partial updates
      });

      if (!res.data.success) {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("❌ Status update failed:", error);
      // Rollback if API fails
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? { ...cat, status: currentStatus } : cat))
      );
      alert("⚠️ Failed to update status on server.");
    }
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
              : "/images/default.jpg"
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
      className: "text-center",
      render: (item) => (
        <TableActions
          onEdit={() => handleEdit(item)}
        // onDelete={() => handleDelete(item.id)}
        />
      ),
    },
  ];
  // console.log(categories);

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
        addLabel="Add Category"
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
    </div >
  );
});

export default Category;
