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
import { toast } from "react-toastify";

const ChildCategory = () => {
  // ===== States =====
  const [childCats, setChildCats] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const [show, setShow] = useState(false);
  const [editingChild, setEditingChild] = useState(null);

  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [childCategoryName, setChildCategoryName] = useState("");
  const [childCategoryDetails, setChildCategoryDetails] = useState("");
  const [status, setStatus] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  // console.log(childCats);

  // ===== Fetch Subcategories =====
  const fetchSubcategories = useCallback(async () => {
    try {
      const res = await API.get("/subCategories");
      setSubcategories(res.data.data || []);
    } catch (err) {
      toast.error("❌ Failed to fetch subcategories:", err);
    }
  }, []);

  // ===== Fetch Child Categories =====
  const fetchChildCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/childCategories");
      setChildCats(res.data.data || res.data);
    } catch (error) {
      toast.error("❌ Failed to fetch child categories", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubcategories();
    fetchChildCategories();
  }, [fetchSubcategories, fetchChildCategories]);

  // ===== Add / Update Child Category =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSubcategory) return toast.error("⚠️ Please select a subcategory!");
    if (!childCategoryName.trim())
      return toast.error("⚠️ Child category name is required!");

    try {
      const formData = new FormData();
      formData.append("sub_category_id", selectedSubcategory);
      formData.append("name", childCategoryName.trim());
      formData.append("description", childCategoryDetails || "");
      formData.append("status", status);
      if (imageFile) formData.append("image", imageFile);
      // for (let [key, value] of formData.entries()) {
      //   console.log("FormData:", key, value);
      // }
      let res;
      if (editingChild) {
        res = await API.post(
          `childCategories/${editingChild.id}?_method=PUT`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        res = await API.post("childCategories", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      const { success, data, message } = res.data;
      if (success) {
        toast.success(message || "Child category saved successfully!");
        setShow(false);
        setEditingChild(null);
        setSelectedSubcategory("");
        setChildCategoryName("");
        setChildCategoryDetails("");
        setStatus("");
        setImageFile(null);
        setImagePreview(null);
        fetchChildCategories();
      } else {
        toast.error(message || "Something went wrong!");
      }
    } catch (err) {
      console.error("Error saving child category:", err.response?.data || err);
      const errors = err.response?.data?.errors;
      if (errors) {
        toast.error(Object.values(errors)[0][0]);
      } else {
        toast.error(err.response?.data?.message || "Server error!");
      }
    }
  };

  // ===== Edit Child Category =====
  const handleEdit = (child) => {
    setEditingChild(child);
    setSelectedSubcategory(child.sub_category_id);
    setChildCategoryName(child.name);
    setChildCategoryDetails(child.description || "");
    setStatus(child.status || 0);
    setImagePreview(child.image?.startsWith("http") ? child.image : `${IMAGE_URL}${child.image}`);
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
  // ===== Toggle Status =====
  const handleToggleStatus = useCallback(async (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;

    // Optimistic Update: Update the UI immediately
    setChildCats((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, status: newStatus } : cat))
    );

    try {
      // API Call to toggle status
      const res = await API.post(`childCategories/${id}/toggle-status`, {
        status: newStatus,
        _method: 'PATCH'
      });
      toast.success("✅ Status updated successfully!");
      if (!res.data.success) {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      toast.error("❌ Status update failed:", error);

      // Rollback: Revert the UI if the API call fails
      setChildCats((prev) =>
        prev.map((cat) => (cat.id === id ? { ...cat, status: currentStatus } : cat))
      );

      toast.error("⚠️ Failed to update status on server.");
    }
  }, []);
  // ===== Table Columns =====
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
    { key: "category", label: "Category", render: (item) => item.sub_category.category.name },
    { key: "subcategory", label: "Subcategory", render: (item) => item.sub_category.name },
    { key: "name", label: "Child Category", sortable: true },
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
    const filtered = childCats.filter((cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const total = Math.ceil(filtered.length / perPage);
    const start = (page - 1) * perPage;
    return { currentData: filtered.slice(start, start + perPage), totalPages: total };
  }, [childCats, searchTerm, perPage, page]);
  return (
    <div className="px-4">
      <PageHeader
        title="Child Categories"
        searchTerm={searchTerm}
        onSearch={handleSearch}
        perPage={perPage}
        onPerPageChange={handlePerPageChange}
        addLabel="Add Child Category"
        onAddClick={() => {
          setEditingChild(null);
          setShow(true);
          setSelectedSubcategory("");
          setChildCategoryName("");
          setChildCategoryDetails("");
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

        <SlidePanel show={show} title={editingChild ? "Edit Child Category" : "Add Child Category"} onClose={() => setShow(false)}>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col w-full gap-1 mb-5">
              <label className="text-sm font-medium">Select Subcategory <span className="text-red">*</span></label>
              <select className="px-2 py-2 border rounded-md" value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)}>
                <option value="">-- Choose Subcategory --</option>
                {subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} ({sub.category.name})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col w-full gap-1 mb-5">
              <label className="text-sm font-medium">Child Category Name <span className="text-red">*</span></label>
              <input type="text" className="px-2 py-2 border rounded-md" value={childCategoryName} onChange={(e) => setChildCategoryName(e.target.value)} />
            </div>

            <div className="flex flex-col w-full gap-1 mb-5">
              <label className="text-sm font-medium">Description (optional)</label>
              <textarea className="px-2 py-2 border rounded-md" value={childCategoryDetails} onChange={(e) => setChildCategoryDetails(e.target.value)} rows={3} />
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
            <div className="flex flex-col w-full gap-1 mb-2">
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

            <button type="submit" className="w-full bg-main text-white py-2 rounded-md">
              {editingChild ? "Update Child Category" : "Add Child Category"}
            </button>
          </form>
        </SlidePanel>
      </div>
    </div>
  );
};

export default ChildCategory;
