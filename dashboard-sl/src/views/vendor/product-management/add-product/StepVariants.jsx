/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import { Boxes, Plus, Search, X } from "lucide-react";
import Heading from "../../../../components/common/Heading";
import API from "../../../../utils/api";

const uid = () =>
  crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random()}`;

const inputClass = (hasError) =>
  [
    "w-full min-w-[100px] px-2 py-1 rounded outline-none transition-all duration-300",
    hasError
      ? "border border-red ring-1 ring-red/40 bg-red/5"
      : "border border-border focus:ring-1 focus:ring-main",
  ].join(" ");

const StepVariants = ({ formData, onChange }) => {
  // Check if current category is 8 (IT Products)
  const isDigitalCategory = formData?.basicInfo?.category == 8;
  const {
    formState: { errors },
  } = useFormContext();
  // console.log(formData);

  const [attributes, setAttributes] = useState([]);
  const [useGlobalPricing, setUseGlobalPricing] = useState(false);
  const [globalPrice, setGlobalPrice] = useState("");
  const [globalDiscount, setGlobalDiscount] = useState("");
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [selectedValues, setSelectedValues] = useState({});
  const [rows, setRows] = useState([]);
  const [searchMap, setSearchMap] = useState({});
  const [newValueMap, setNewValueMap] = useState({});
  const [bulk, setBulk] = useState({ price: "", discount: "", stock: "" });
  // console.log(attributes);

  // Fetch attributes from API
  useEffect(() => {
    API.get("/attributes")
      .then((res) => {
        setAttributes(res.data.data);
      })
      .catch((err) => console.error("Failed to fetch attributes:", err));
  }, []);


  // ===== Active attributes (from API) =====
  // ===== Filtered attributes based on Category =====
  const activeAttributes = useMemo(() => {
    const isDigitalCategory = formData?.basicInfo?.category == 8;

    return attributes.filter((attr) => {
      // Basic status check
      const isAvailable = attr.status == null || attr.status === 1;
      if (!isAvailable) return false;

      if (isDigitalCategory) {
        // If Category is 8, ONLY show Attribute 5
        return attr.id == 5;
      } else {
        // For all other categories, show everything EXCEPT Attribute 5
        return attr.id != 5;
      }
    });
  }, [attributes, formData?.basicInfo?.category]);
  useEffect(() => {
    if (formData?.basicInfo?.category == 8) {
      // Auto-select attribute 5 if it's not already selected
      setSelectedAttributes((prev) => prev.includes(5) ? prev : [5]);
    } else {
      // Optional: Clear attribute 5 if category changes away from 8
      setSelectedAttributes((prev) => prev.filter(id => id !== 5));
    }
  }, [formData?.basicInfo?.category]);

  useEffect(() => {
    if (!rows.length && formData?.variants?.length > 0) {
      setRows(formData.variants);
    }

    if (
      !selectedAttributes.length &&
      Object.keys(selectedValues).length === 0 &&
      formData?.variantMeta
    ) {
      setSelectedAttributes(formData.variantMeta.selectedAttributes || []);
      setSelectedValues(formData.variantMeta.selectedValues || {});
    }
  }, []);
  // formData?.variants?.length, formData?.variantMeta;

  // ===== Toggle attribute selection =====
  const toggleAttribute = (attrId) => {
    setSelectedAttributes((prev) => {
      if (prev.includes(attrId)) {
        const updated = prev.filter((id) => id !== attrId);
        const { [attrId]: _removed, ...rest } = selectedValues;
        setSelectedValues(rest);
        return updated;
      }
      return [...prev, attrId];
    });
  };

  // ===== Toggle attribute value =====
  const handleValueSelect = (attrId, val) => {
    setSelectedValues((prev) => {
      const current = prev[attrId] || [];
      return {
        ...prev,
        [attrId]: current.includes(val)
          ? current.filter((v) => v !== val)
          : [...current, val],
      };
    });
  };

  // ===== Add new custom value =====
  const handleAddNewValue = (attrId) => {
    const val = (newValueMap[attrId] || "").trim();
    if (!val) return alert("Enter a value first");
    const exists = (selectedValues[attrId] || []).some(
      (v) => v.toLowerCase() === val.toLowerCase()
    );
    if (exists) return alert("Value already selected!");

    setSelectedValues((prev) => ({
      ...prev,
      [attrId]: [...(prev[attrId] || []), val],
    }));
    setNewValueMap((p) => ({ ...p, [attrId]: "" }));
  };

  const handleSearch = (attrId, text) =>
    setSearchMap((prev) => ({ ...prev, [attrId]: text }));

  // ===== Cartesian helper =====
  const cartesian = (arrays) =>
    arrays.reduce(
      (acc, curr) => acc.flatMap((a) => curr.map((b) => a.concat([b]))),
      [[]]
    );

  // ===== Generate row matrix whenever selection changes =====
  useEffect(() => {
    const selectedAttrs = activeAttributes.filter((a) =>
      selectedAttributes.includes(a.id)
    );
    const matrix = selectedAttrs.map((attr) => selectedValues[attr.id] || []);

    if (!selectedAttrs.length || matrix.some((arr) => !arr.length)) {
      setRows([]);
      onChange("variants", []);
      onChange("variantMeta", { selectedAttributes, selectedValues });
      return;
    }

    const combos = cartesian(matrix);
    const next = combos.map((vals) => {
      const attributes = selectedAttrs.reduce((acc, attr, idx) => {
        acc[attr.name] = vals[idx];
        return acc;
      }, {});

      // restore price/stock/sku if same attributes found
      const existing = rows.find(
        (r) =>
          JSON.stringify(Object.entries(r.attributes).sort()) ===
          JSON.stringify(Object.entries(attributes).sort())
      );

      return (
        existing || {
          id: uid(),
          attributes,
          sku: "",
          price: "",
          discount: "",
          stock: "",
        }
      );
    });

    setRows(next);
    onChange("variants", next);
    onChange("variantMeta", { selectedAttributes, selectedValues });
  }, [selectedAttributes, selectedValues]);

  // ===== Sync with parent (to keep persistence) =====
  useEffect(() => {
    onChange("variants", rows);
  }, [JSON.stringify(rows)]);

  // ===== Update helpers =====
  const updateRow = useCallback(
    (id, key, value) => {
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, [key]: value } : r))
      );
    },
    [setRows]
  );

  const removeRow = (id) => setRows((prev) => prev.filter((r) => r.id !== id));

  // ===== Global pricing auto populate =====
  useEffect(() => {
    if (!useGlobalPricing) return;
    setRows((prev) =>
      prev.map((r) => ({
        ...r,
        price: globalPrice !== "" ? globalPrice : r.price,
        discount: globalDiscount !== "" ? globalDiscount : r.discount,
      }))
    );
  }, [useGlobalPricing, globalPrice, globalDiscount]);

  // ===== Bulk apply =====
  const applyBulk = () => {
    setRows((prev) =>
      prev.map((r) => ({
        ...r,
        price: bulk.price !== "" ? bulk.price : r.price,
        discount: bulk.discount !== "" ? bulk.discount : r.discount,
        stock: bulk.stock !== "" ? bulk.stock : r.stock,
      }))
    );
  };
  const resetBulk = () => setBulk({ price: "", discount: "", stock: "" });

  // ===== SKU generator =====
  const slug = (s) =>
    (s || "")
      .toString()
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const getBaseSku = () => {
    const base = formData?.basicInfo?.sku || formData?.basicInfo?.name || "PRD";
    return slug(base);
  };

  const genSkuForRow = (row) => {
    const parts = Object.entries(row.attributes).map(([_, v]) =>
      slug(`${v}`).replace(/-/g, "")
    );
    return `${getBaseSku()}-${parts.join("-")}`;
  };

  const generateAllSkus = (overwrite = false) => {
    setRows((prev) =>
      prev.map((r) => ({
        ...r,
        sku: overwrite || !r.sku ? genSkuForRow(r) : r.sku,
      }))
    );
  };

  // ====== RENDER ======
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-2">
        <Boxes className="w-5 h-5" />
        <Heading title="Product Variants & Attributes" />
      </div>

      {/* ===== ATTRIBUTE CHOOSER ===== */}
      <div className="bg-white border border-border rounded-md p-4">
        <h4 className="font-medium mb-2">Choose Attributes</h4>

        <div className="flex flex-wrap gap-2">
          {activeAttributes.map((attr) => {
            const active = selectedAttributes.includes(attr.id);
            return (
              <button
                key={attr.id}
                type="button"
                onClick={() => toggleAttribute(attr.id)}
                className={`px-3 py-1 rounded-full text-sm border transition ${active
                  ? "bg-main text-white border-main"
                  : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {attr.name}
              </button>
            );
          })}
        </div>

        {/* ===== VALUE SELECTORS ===== */}
        {selectedAttributes.map((attrId) => {
          const attr = attributes.find((a) => a.id === attrId);
          if (!attr) return null;

          const search = (searchMap[attrId] || "").toLowerCase();
          const values =
            attr.values?.filter(
              (v) =>
                (v.status == null || v.status === 1) &&
                v.value.toLowerCase().includes(search)
            ) || [];

          const selected = selectedValues[attrId] || [];

          return (
            <div
              key={attrId}
              className="mt-4 border border-border rounded-md p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{attr.name} Values</span>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-2 top-2.5 text-gray-400" />
                  <input
                    value={searchMap[attrId] || ""}
                    onChange={(e) => handleSearch(attrId, e.target.value)}
                    placeholder="Search value..."
                    className="pl-7 pr-3 py-1.5 border border-border rounded-md text-sm outline-none"
                  />
                </div>
              </div>

              {/* Suggested values */}
              <div className="flex flex-wrap gap-2 mb-3">
                {values.map((v) => {
                  const active = selected.includes(v.value);
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => handleValueSelect(attrId, v.value)}
                      className={`px-2.5 py-1 rounded-full text-xs border transition ${active
                        ? "bg-main text-white border-main"
                        : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                        }`}
                    >
                      {v.value}
                    </button>
                  );
                })}
              </div>

              {/* Add new */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newValueMap[attrId] || ""}
                  onChange={(e) =>
                    setNewValueMap((p) => ({ ...p, [attrId]: e.target.value }))
                  }
                  placeholder={`Add new ${attr.name} value...`}
                  className="px-3 py-1.5 border border-border rounded-md text-sm outline-none flex-1"
                />
                <button
                  type="button"
                  onClick={() => handleAddNewValue(attrId)}
                  className="flex items-center gap-1 bg-main text-white px-3 py-1.5 rounded-md hover:bg-mainHover text-sm"
                >
                  <Plus size={14} /> Add
                </button>
              </div>

              {/* Selected chips */}
              {selected.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selected.map((val) => (
                    <span
                      key={val}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-main/10 text-main text-xs border border-main/30"
                    >
                      {val}
                      <button
                        type="button"
                        onClick={() => handleValueSelect(attrId, val)}
                        className="text-main hover:text-mainHover"
                        title="Remove"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ===== GLOBAL & BULK PRICING ===== */}
      {rows.length > 0 && (
        <>
          {/* Global toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm font-medium">Use Global Pricing</label>
            <button
              type="button"
              onClick={() => setUseGlobalPricing((p) => !p)}
              className={`px-4 py-1 rounded-full text-sm font-medium border ${useGlobalPricing
                ? "bg-green/15 text-green border-green"
                : "bg-gray-100 text-gray-600 border-gray-300"
                }`}
            >
              {useGlobalPricing ? "Enabled" : "Disabled"}
            </button>

            {useGlobalPricing && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Global Price"
                  value={globalPrice}
                  onChange={(e) => setGlobalPrice(e.target.value)}
                  className="border border-border rounded px-2 py-1 w-32"
                />
                <input
                  type="number"
                  placeholder="Global Discount %"
                  value={globalDiscount}
                  onChange={(e) => setGlobalDiscount(e.target.value)}
                  className="border border-border rounded px-2 py-1 w-40"
                />
              </div>
            )}
          </div>

          {/* Bulk toolbar */}
          <div className="bg-white border border-border rounded-md p-3 flex flex-wrap items-end gap-3 mt-3">
            <div className="flex flex-col">
              <label className="text-xs text-gray-500">Price</label>
              <input
                type="number"
                value={bulk.price}
                onChange={(e) =>
                  setBulk((p) => ({ ...p, price: e.target.value }))
                }
                className="border border-border rounded px-2 py-1 w-32"
                placeholder="e.g. 1999"
              />
            </div>
            {/* <div className="flex flex-col">
              <label className="text-xs text-gray-500">Discount %</label>
              <input
                type="number"
                value={bulk.discount}
                onChange={(e) =>
                  setBulk((p) => ({ ...p, discount: e.target.value }))
                }
                className="border border-border rounded px-2 py-1 w-32"
                placeholder="e.g. 10"
              />
            </div> */}
            {!isDigitalCategory && (
              <div className="flex flex-col">
                <label className="text-xs text-gray-500">Stock</label>
                <input
                  type="number"
                  value={bulk.stock}
                  onChange={(e) =>
                    setBulk((p) => ({ ...p, stock: e.target.value }))
                  }
                  className="border border-border rounded px-2 py-1 w-32"
                  placeholder="e.g. 50"
                />
              </div>
            )}
            {/* <div className="flex flex-col">
              <label className="text-xs text-gray-500">Stock</label>
              <input
                type="number"
                value={bulk.stock}
                onChange={(e) =>
                  setBulk((p) => ({ ...p, stock: e.target.value }))
                }
                className="border border-border rounded px-2 py-1 w-32"
                placeholder="e.g. 50"
              />
            </div> */}

            <button
              type="button"
              onClick={applyBulk}
              className="bg-main hover:bg-mainHover text-white px-4 py-2 rounded-md text-sm"
            >
              Apply to All
            </button>
            <button
              type="button"
              onClick={resetBulk}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm"
            >
              Reset
            </button>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => generateAllSkus(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm"
              >
                Generate SKUs (empty only)
              </button>
              <button
                type="button"
                onClick={() => generateAllSkus(true)}
                className="bg-main hover:bg-mainHover text-white px-4 py-2 rounded-md text-sm"
              >
                Generate SKUs (overwrite)
              </button>
            </div>
          </div>

          {/* ===== VARIANT TABLE ===== */}
          <div className="bg-white border border-border rounded-md p-4 mt-3">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-xs md:text-sm">
                <thead>
                  <tr>
                    {Object.keys(rows[0].attributes || {}).map((key) => (
                      <th key={key} className="py-2 px-3 capitalize text-left">
                        {key}
                      </th>
                    ))}
                    <th>SKU</th>
                    <th>Price</th>
                    {/* <th>Discount</th> */}
                    {!isDigitalCategory && <th>Stock</th>}
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => {
                    const vErr = errors?.variants?.[idx];
                    return (
                      <tr key={row.id} className="border-b">
                        {Object.values(row.attributes).map((v, i) => (
                          <td key={i} className="py-2 px-3">
                            {v}
                          </td>
                        ))}

                        {/* SKU */}
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.sku}
                            onChange={(e) =>
                              updateRow(row.id, "sku", e.target.value)
                            }
                            className={inputClass(vErr?.sku)}
                          />
                        </td>

                        {/* Price */}
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            value={row.price}
                            disabled={useGlobalPricing}
                            onChange={(e) =>
                              updateRow(row.id, "price", e.target.value)
                            }
                            className={inputClass(vErr?.price)}
                          />
                        </td>

                        {/* Discount */}
                        {/* <td className="py-2 px-3">
                          <input
                            type="number"
                            value={row.discount}
                            disabled={useGlobalPricing}
                            onChange={(e) =>
                              updateRow(row.id, "discount", e.target.value)
                            }
                            className={inputClass(vErr?.discount)}
                          />
                        </td> */}

                        {/* Stock */}
                        {!isDigitalCategory && (
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              value={row.stock}
                              onChange={(e) =>
                                updateRow(row.id, "stock", e.target.value)
                              }
                              className={inputClass(vErr?.stock)}
                            />
                          </td>
                        )}
                        {/* <td className="py-2 px-3">
                          <input
                            type="number"
                            value={row.stock}
                            onChange={(e) =>
                              updateRow(row.id, "stock", e.target.value)
                            }
                            className={inputClass(vErr?.stock)}
                          />
                        </td> */}

                        <td className="py-2 px-3">
                          <button
                            type="button"
                            onClick={() => removeRow(row.id)}
                            className="text-red text-xs hover:text-deepRed"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* whole-array error */}
            {errors?.variants &&
              typeof errors.variants.message === "string" && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red text-sm mt-3"
                >
                  {errors.variants.message}
                </motion.p>
              )}
          </div>
        </>
      )}

      {!rows.length && (
        <p className="text-gray-500 text-sm">
          Select attribute values to generate variants.
        </p>
      )}
    </div>
  );
};

export default StepVariants;