"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function SearchInput({
  initialCategory = "",
  initialQuery = "",
  onOpen = () => {},
  onClose = () => {},
  onQueryChange = () => {}, // notify parent of typing
  onCategoryChange = () => {},
}) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery || "");
  const [category, setCategory] = useState(initialCategory || "");

  const { items: categories = [], loading } = useSelector(
    (state) => state.category || { items: [], loading: false }
  );

  const flatCats = useMemo(() => {
    if (!Array.isArray(categories)) return [];
    return categories.map((c) => ({
      id: c.id,
      name: c.name,
    }));
  }, [categories]);

  useEffect(() => {
    // whenever q changes notify parent (for dynamic search)
    onQueryChange(q);
  }, [q, onQueryChange]);

  useEffect(() => {
    onCategoryChange(category);
  }, [category, onCategoryChange]);

  const submit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category_id", category);
    router.push(`/search?${params.toString()}`);
    onClose();
  };

  return (
    <form onSubmit={submit} className="flex items-center w-full">
      <div className="min-w-[160px] px-2">
        <select
          value={category}
          onFocus={onOpen}
          onChange={(e) => setCategory(e.target.value)}
          className="text-textSecondary text-sm bg-transparent outline-none cursor-pointer w-full"
        >
          <option value="">{loading ? "Loading..." : "All Categories"}</option>

          {flatCats.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <input
        type="text"
        value={q}
        onFocus={onOpen}
        onChange={(e) => setQ(e.target.value)}
        placeholder="What do you need?"
        className="w-full border-none outline-none px-4 py-2 text-sm text-textPrimary bg-bgSurface"
      />

      <button
        type="submit"
        className="bg-main hover:bg-mainHover text-white px-5 py-2 text-sm font-medium transition-all"
      >
        SEARCH
      </button>
    </form>
  );
}
