"use client";

import { useMemo, useState } from "react";

/**
 * FilterSidebar
 *
 * Unified sidebar filter for PLP
 */
export default function FilterSidebar({
  filters = {},
  selected = {},
  onFilterChange = () => {},
}) {
  const { brands = [], ratings = [], priceRange = [], vendors = [] } = filters;

  const {
    brands: selBrands = [],
    ratings: selRatings = [],
    price: selPrice = priceRange,
    discounts: selDiscounts = [],
    vendors: selVendors = [],
    availability = null,
  } = selected;

  /* ---------------- Helpers ---------------- */

  const toggleArray = (key, value) => {
    const list = selected[key] || [];
    const next = list.includes(value)
      ? list.filter((v) => v !== value)
      : [...list, value];
    onFilterChange({ ...selected, [key]: next });
  };

  const setAvailability = (value) => {
    onFilterChange({
      ...selected,
      availability: availability === value ? null : value,
    });
  };

  const updatePrice = (index, value) => {
    const next = [...(selPrice || priceRange)];
    next[index] = Number(value);
    onFilterChange({ ...selected, price: next });
  };

  /* ---------------- Discount presets ---------------- */
  const discountOptions = useMemo(() => [10, 20, 30, 50], []);

  return (
    <aside className="bg-white border border-border rounded-lg p-4 space-y-6 sticky top-[100px]">
      {/* ========== Availability ========== */}
      <section>
        <h4 className="text-sm font-semibold mb-3">Availability</h4>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={availability === "in"}
            onChange={() => setAvailability("in")}
          />
          In stock
        </label>
      </section>

      {/* ========== Price Range ========== */}
      {priceRange.length === 2 && (
        <section>
          <h4 className="text-sm font-semibold mb-3">Price Range</h4>

          <div className="flex items-center gap-2">
            <input
              type="number"
              value={selPrice?.[0] ?? priceRange[0]}
              min={priceRange[0]}
              max={priceRange[1]}
              onChange={(e) => updatePrice(0, e.target.value)}
              className="w-full border border-border rounded px-2 py-1 text-sm"
            />
            <span className="text-xs">—</span>
            <input
              type="number"
              value={selPrice?.[1] ?? priceRange[1]}
              min={priceRange[0]}
              max={priceRange[1]}
              onChange={(e) => updatePrice(1, e.target.value)}
              className="w-full border border-border rounded px-2 py-1 text-sm"
            />
          </div>
        </section>
      )}

      {/* ========== Discount ========== */}
      <section>
        <h4 className="text-sm font-semibold mb-3">Discount</h4>
        <ul className="space-y-2">
          {discountOptions.map((d) => (
            <li key={d}>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selDiscounts.includes(d)}
                  onChange={() => toggleArray("discounts", d)}
                />
                {d}% or more
              </label>
            </li>
          ))}
        </ul>
      </section>

      {/* ========== Brand ========== */}
      {brands.length > 0 && (
        <section>
          <h4 className="text-sm font-semibold mb-3">Brand</h4>
          <ul className="space-y-2 max-h-48 overflow-auto">
            {brands.map((b) => (
              <li key={b}>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selBrands.includes(b)}
                    onChange={() => toggleArray("brands", b)}
                  />
                  {b}
                </label>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ========== Rating ========== */}
      {ratings.length > 0 && (
        <section>
          <h4 className="text-sm font-semibold mb-3">Rating</h4>
          <ul className="space-y-2">
            {ratings.map((r) => (
              <li key={r}>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selRatings.includes(r)}
                    onChange={() => toggleArray("ratings", r)}
                  />
                  {r}★ & above
                </label>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ========== Store / Vendor ========== */}
      {vendors.length > 0 && (
        <section>
          <h4 className="text-sm font-semibold mb-3">Store</h4>
          <ul className="space-y-2 max-h-48 overflow-auto">
            {vendors.map((v) => (
              <li key={v.id}>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selVendors.includes(v.id)}
                    onChange={() => toggleArray("vendors", v.id)}
                  />
                  {v.name}
                </label>
              </li>
            ))}
          </ul>
        </section>
      )}
    </aside>
  );
}
