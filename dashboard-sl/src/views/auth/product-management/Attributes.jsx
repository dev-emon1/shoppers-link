"use client";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import PageHeader from "../../../components/common/PageHeader";
import Table from "../../../components/table/Table";
import TableActions from "../../../components/table/TableActions";
import StatusBadge from "../../../components/common/StatusBadge";
import SlidePanel from "../../../components/common/SlidePanel";
import Pagination from "../../../components/Pagination";
import FilterBar from "../../../components/common/FilterBar";

const API_URL = "http://127.0.0.1:8000/api/attributes";

const Attributes = React.memo(() => {
  // ===== States =====
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [attributeName, setAttributeName] = useState("");
  const [status, setStatus] = useState("active");
  const [editingAttribute, setEditingAttribute] = useState(null); // ✅ Track attribute being edited

  // ===== Fetch Attributes =====
  const fetchAttributes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setAttributes(res.data.data || res.data); // handles Laravel resource or direct data
    } catch (error) {
      console.error("❌ Failed to fetch attributes", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttributes();
  }, [fetchAttributes]);

  // ===== Create or Update Attribute =====
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!attributeName.trim()) return alert("⚠️ Attribute name is required!");

      try {
        const payload = { name: attributeName.trim(), status };
        // console.log(payload);

        if (editingAttribute) {
          // ✅ Update existing attribute
          const res = await axios.put(`${API_URL}/${editingAttribute.id}`, payload);
          const updatedAttribute = res.data.data || res.data;
          setAttributes((prev) =>
            prev.map((attr) => (attr.id === updatedAttribute.id ? updatedAttribute : attr))
          );
          alert("✅ Attribute updated successfully!");
        } else {
          // ✅ Create new attribute
          const res = await axios.post(API_URL, payload);
          const newAttribute = res.data.data || res.data;
          setAttributes((prev) => [...prev, newAttribute]);
          alert("✅ Attribute added successfully!");
        }

        // Reset form
        setAttributeName("");
        setStatus("active");
        setEditingAttribute(null);
        setShow(false);
      } catch (error) {
        console.error("❌ Failed:", error.response?.data || error.message);
        alert("⚠️ " + (error.response?.data?.message || "Validation failed!"));
      }
    },
    [attributeName, status, editingAttribute]
  );

  // ===== Edit Handler =====
  const handleEdit = useCallback((attribute) => {
    setEditingAttribute(attribute);
    setAttributeName(attribute.name);
    setStatus(attribute.status);
    setShow(true);
  }, []);

  // ===== Delete Handler (Optional) =====
  const handleDelete = useCallback(async (id) => {
    if (!confirm("Are you sure you want to delete this attribute?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setAttributes((prev) => prev.filter((attr) => attr.id !== id));
      alert("✅ Attribute deleted successfully!");
    } catch (error) {
      console.error("❌ Failed to delete:", error.response?.data || error.message);
      alert("⚠️ Could not delete attribute!");
    }
  }, []);

  // ====== Handlers ======
  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  }, []);

  const handlePerPageChange = useCallback((e) => {
    setPerPage(Number(e.target.value));
    setPage(1);
  }, []);


  // ====== Filter + Pagination ======
  const { currentData, totalPages } = useMemo(() => {
    let filtered = attributes;

    if (searchTerm.trim()) {
      filtered = filtered.filter((attr) =>
        attr.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    const total = Math.ceil(filtered.length / perPage);
    const start = (page - 1) * perPage;
    const current = filtered.slice(start, start + perPage);

    return { currentData: current, totalPages: total };
  }, [attributes, searchTerm, perPage, page]);

  // ====== Table Columns ======
  const columns = [
    {
      key: "no",
      label: "No",
      render: (item, i) => (page - 1) * perPage + i + 1,
      className: "text-center w-[50px]",
    },
    {
      key: "name",
      label: "Attribute Name",
      sortable: true,
      render: (item) => (
        <span className="capitalize">{item.name}</span>
      ),
      // className: "font-medium text-gray-800",
    },
    {
      key: "slug",
      label: "Slug",
      render: (item) => (
        <span className="lowercase">{item.slug}</span>
      ),
      className: "hidden sm:table-cell",
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

  return (
    <div className="px-4">
      {/* ===== Page Header ===== */}
      <PageHeader
        title="Product Attributes"
        searchTerm={searchTerm}
        onSearch={handleSearch}
        onAddClick={() => {
          setEditingAttribute(null);
          setAttributeName("");
          setStatus("active");
          setShow(true);
        }}
        addLabel="Add Attribute"
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
              enableCheckbox
              showFooter
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

        {/* ===== Add/Edit Attribute Slide Panel ===== */}
        <SlidePanel
          show={show}
          title={editingAttribute ? "Edit Attribute" : "Add Attribute"}
          onClose={() => {
            setShow(false);
            setEditingAttribute(null);
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* Attribute Name */}
            <div className="flex flex-col w-full gap-1 mb-5">
              <label className="text-sm font-medium mb-1">
                Attribute Name <span className="text-red">*</span>
              </label>
              <input
                type="text"
                className="px-3 py-2 border rounded-md text-sm outline-none focus:ring-1 focus:ring-main"
                placeholder="Enter attribute name"
                value={attributeName}
                onChange={(e) => setAttributeName(e.target.value)}
              />
            </div>

            {/* Submit */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={!attributeName}
                className={`w-full rounded-md px-7 py-2 text-white text-sm font-medium transition-all ${!attributeName
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-main hover:bg-mainHover"
                  }`}
              >
                {editingAttribute ? "Update Attribute" : "Add Attribute"}
              </button>
            </div>
          </form>
        </SlidePanel>
      </div>
    </div>
  );
});

export default Attributes;
