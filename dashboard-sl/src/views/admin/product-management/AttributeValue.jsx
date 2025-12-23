"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import PageHeader from "../../../components/common/PageHeader";
import Table from "../../../components/table/Table";
import TableActions from "../../../components/table/TableActions";
import SlidePanel from "../../../components/common/SlidePanel";
import Pagination from "../../../components/Pagination";
import FilterBar from "../../../components/common/FilterBar";
import API from "../../../utils/api";


const AttributeValue = () => {
  // ==== States ====
  const [values, setValues] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [show, setShow] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedAttribute, setSelectedAttribute] = useState("");
  const [valueName, setValueName] = useState("");
  const [status, setStatus] = useState("active");
  const [editingValue, setEditingValue] = useState(null);
  // console.log(attributes);

  // ==== Fetch Attributes ====
  const fetchAttributes = useCallback(async () => {
    try {
      const res = await API.get("/attributes");
      setAttributes(res.data.data || res.data);
    } catch (error) {
      console.error("❌ Failed to fetch attributes:", error);
    }
  }, []);

  // ==== Fetch All Values ====
  const fetchValues = useCallback(async () => {
    try {
      const res = await API.get("/attributeValues");
      setValues(res.data.data || []);
    } catch (error) {
      console.error("❌ Failed to fetch attribute values:", error);
    }
  }, []);

  useEffect(() => {
    fetchAttributes();
    fetchValues();
  }, [fetchAttributes, fetchValues]);

  // ==== Derived Filtered Values ====
  const filteredValues = useMemo(() => {
    return values
      .filter((item) =>
        searchTerm
          ? item.value.toLowerCase().includes(searchTerm.toLowerCase())
          : true
      )
      .filter((item) =>
        filterStatus ? item.status === filterStatus : true
      );
  }, [values, searchTerm, filterStatus]);

  // ==== Derived Paginated Values ====
  const paginatedValues = useMemo(() => {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    setTotalPages(Math.ceil(filteredValues.length / perPage));
    return filteredValues.slice(start, end);
  }, [filteredValues, page, perPage]);

  // ==== Add / Update ====
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAttribute) return alert("⚠️ Please select an attribute!");
    if (!valueName.trim()) return alert("⚠️ Enter attribute value!");

    const payload = {
      attribute_id: selectedAttribute,
      value: valueName.trim(),
      status,
    };
    // console.log(payload);

    try {
      if (editingValue) {
        await API.put(`attributeValues/${editingValue.id}`, payload);
        alert("✅ Attribute Value updated successfully!");
      } else {
        await API.post("attributeValues", payload);
        alert("✅ Attribute Value added successfully!");
      }

      // Reset form
      setValueName("");
      setSelectedAttribute("");
      setStatus("active");
      setEditingValue(null);
      setShow(false);

      // Refresh values
      fetchValues();
    } catch (error) {
      console.error("❌ Failed to save:", error.response?.data || error.message);
      alert("⚠️ " + (error.response?.data?.message || "Operation failed!"));
    }
  };

  // ==== Edit Handler ====
  const handleEdit = (item) => {
    setEditingValue(item);
    setSelectedAttribute(item.attribute.id);
    setValueName(item.value);
    setStatus(item.status);
    setShow(true);
  };

  // ==== Table Columns ====
  const columns = [
    { key: "no", label: "No", render: (item, i) => (page - 1) * perPage + i + 1, className: "text-center w-[50px]" },
    { key: "attribute", label: "Attribute", render: (item) => item.attribute.name },
    { key: "value", label: "Value" },
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

  return (
    <div className="px-4">
      <PageHeader
        title="Attribute Values"
        searchTerm={searchTerm}
        onSearch={(e) => { setSearchTerm(e.target.value); setPage(1); }}
        onAddClick={() => {
          setEditingValue(null);
          setSelectedAttribute("");
          setValueName("");
          setStatus("active");
          setShow(true);
        }}
        addLabel={editingValue ? "Edit Value" : "Add Value"}
      />

      <div className="mb-4 bg-white p-3 rounded-md shadow-sm">
        <FilterBar
          perPage={perPage}
          onFilterChange={(type, value) => {
            if (type === "status") setFilterStatus(value);
            setPage(1);
          }}
          onPerPageChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
        />
      </div>

      <div className="flex flex-wrap w-full">
        <div className="w-full lg:w-7/12">
          <div className="bg-white p-4 rounded-md shadow-md overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            <Table
              columns={columns}
              data={paginatedValues}
              page={page}
              perPage={perPage}
              enableCheckbox
              showFooter
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

        <SlidePanel
          show={show}
          title={editingValue ? "Edit Attribute Value" : "Add Attribute Value"}
          onClose={() => { setShow(false); setEditingValue(null); }}
        >
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col w-full gap-1 mb-5">
              <label className="text-sm font-medium mb-1">
                Select Attribute <span className="text-red">*</span>
              </label>
              <select
                className="px-2 py-2 border border-border rounded-md outline-none"
                value={selectedAttribute}
                onChange={(e) => setSelectedAttribute(e.target.value)}
              >
                <option value="">-- Choose Attribute --</option>
                {attributes.map((attr) => (
                  <option key={attr.id} value={attr.id}>
                    {attr.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col w-full gap-1 mb-5">
              <label className="text-sm font-medium mb-1">
                Value Name <span className="text-red">*</span>
              </label>
              <input
                type="text"
                className="px-2 py-2 border border-border rounded-md text-sm outline-none focus:ring-1 focus:ring-main"
                placeholder="Enter attribute value"
                value={valueName}
                onChange={(e) => setValueName(e.target.value)}
                disabled={!selectedAttribute}
              />
            </div>


            <div className="mt-8">
              <button
                type="submit"
                disabled={!selectedAttribute || !valueName}
                className={`${!selectedAttribute || !valueName
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-main hover:bg-mainHover"
                  } transition-all duration-150 w-full text-white rounded-md px-7 py-2`}
              >
                {editingValue ? "Update Value" : "Add Value"}
              </button>
            </div>
          </form>
        </SlidePanel>
      </div>
    </div>
  );
};

export default AttributeValue;
