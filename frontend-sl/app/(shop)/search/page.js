// app/(shop)/search/page.js
"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { searchProducts } from "@/modules/search/services/searchService";
import SearchProductGrid from "@/modules/search/components/SearchProductGrid";

export default function SearchPage() {
  const params = useSearchParams();
  const router = useRouter();
  const q = params.get("q") || params.get("search") || "";
  const category = params.get("category") || "";
  const initialPage = parseInt(params.get("page") || "1", 10);

  // state
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [perPage] = useState(12);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({}); // e.g., { price: [min, max], brands: [], ratings: [] }
  const [sort, setSort] = useState(""); // e.g., price_asc, price_desc

  // fetch function (paginated)
  const fetchPage = useCallback(
    async (pageToFetch = 1, replace = false) => {
      setLoading(true);
      try {
        // build params for backend (backend expects 'search' param based on your controller)
        const args = {
          q: q, // local param name — adjust searchService to use 'search' param (we already did)
        };

        // The searchService we used earlier expects { q } param; it builds URL as /allProducts?search=...
        // For paginated fetching, we use fetch directly to /allProducts with per_page and page
        const searchParams = new URLSearchParams();
        if (q) searchParams.set("search", q);
        if (category) searchParams.set("category", category);
        if (filters?.price?.length === 2) {
          if (filters.price[0])
            searchParams.set("min_price", String(filters.price[0]));
          if (filters.price[1])
            searchParams.set("max_price", String(filters.price[1]));
        }
        if (sort) searchParams.set("sort", sort);
        searchParams.set("per_page", String(perPage));
        searchParams.set("page", String(pageToFetch));

        const resp = await fetch(`/allProducts?${searchParams.toString()}`);
        if (!resp.ok) throw new Error("Network error");
        const json = await resp.json();
        // API returns paginated resource -> ProductResource::collection($products)
        // payload may be structure { data: [...], meta: { total, current_page, last_page } }
        let dataArray = [];
        let meta = null;
        if (Array.isArray(json)) {
          dataArray = json;
        } else if (Array.isArray(json?.data)) {
          dataArray = json.data;
          meta = json.meta ?? json?.meta;
        } else if (Array.isArray(json?.data?.data)) {
          dataArray = json.data.data;
          meta = json.data.meta ?? null;
        } else if (Array.isArray(json?.products)) {
          dataArray = json.products;
        } else {
          dataArray = json?.data ?? [];
        }

        setTotal(meta?.total ?? json?.meta?.total ?? dataArray.length);

        if (replace) {
          setProducts(dataArray);
        } else {
          setProducts((prev) =>
            pageToFetch === 1 ? dataArray : [...prev, ...dataArray]
          );
        }
        setPage(pageToFetch);
      } catch (err) {
        console.error("SearchPage fetch error:", err);
      } finally {
        setLoading(false);
      }
    },
    [q, category, perPage, filters, sort]
  );

  // initial fetch (on q/category change)
  useEffect(() => {
    // reset page
    if (!q || q.trim().length < 1) {
      setProducts([]);
      setTotal(0);
      return;
    }
    fetchPage(1, true);
  }, [q, category, filters, sort, fetchPage]);

  const handleLoadMore = async () => {
    const next = page + 1;
    await fetchPage(next, false);
  };

  const handleFilterChange = (newSelected) => {
    setFilters(newSelected);
    // push to url maybe
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (category) sp.set("category", category);
    // add filter params if needed
    router.push(`/search?${sp.toString()}`);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  return (
    <div className="container py-8">
      <div className="flex gap-8">
        <div className="w-72">
          {/* <CategorySidebar
            category={{ name: category || "Search results" }}
            showFilters={true}
            filters={{
              brands: [],
              ratings: [],
              priceRange: [0, 100000],
            }}
            selected={filters}
            onFilterChange={handleFilterChange}
          /> */}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold">Search</h1>
              <p className="text-sm text-textSecondary">
                Results for <strong>{q}</strong>
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-textSecondary">
                Total:{" "}
                <span className="font-semibold text-textPrimary">
                  {total ?? "-"}
                </span>
              </div>
              <select
                value={sort}
                onChange={handleSortChange}
                className="border border-border rounded px-2 py-1 text-sm"
              >
                <option value="">Sort</option>
                <option value="price_asc">Price: Low to high</option>
                <option value="price_desc">Price: High to low</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>

          <SearchProductGrid products={products} />

          <div className="mt-6 flex justify-center">
            {loading ? (
              <div className="text-textSecondary">Loading...</div>
            ) : (
              <>
                {/* If server returns total and we loaded all pages, hide Load more */}
                {products.length < total ? (
                  <button
                    onClick={handleLoadMore}
                    className="bg-main text-white px-6 py-2 rounded-lg hover:bg-main/90 transition-all"
                  >
                    Load More
                  </button>
                ) : (
                  products.length > 0 && (
                    <div className="text-textSecondary">End of results</div>
                  )
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
