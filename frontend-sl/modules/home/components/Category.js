// Marks this file as a Client Component (required for hooks & browser APIs)
"use client";

// React core + useEffect hook for lifecycle control
import React, { useEffect } from "react";

// Next.js optimized Image component
import Image from "next/image";

// Next.js Link component for client-side navigation
import Link from "next/link";

// Redux hooks for dispatching actions and reading store state
import { useDispatch, useSelector } from "react-redux";

// Redux async action to fetch all categories from API
import { loadAllCategories } from "@/modules/category/store/categoryReducer";

const CategoryGrid = () => {
  // Initialize Redux dispatch function
  const dispatch = useDispatch();

  // Extract categories and loading state from Redux store
  const { items: categories = [], loading } = useSelector(
    (state) => state.category || {}
  );

  /* ------------------------------------------------------------
     Load categories only once
     Prevents unnecessary API calls on re-render
  ------------------------------------------------------------ */
  useEffect(() => {
    // Fetch categories only if not already loaded
    if (!categories.length) dispatch(loadAllCategories());
  }, [dispatch, categories.length]);

  /* ------------------------------------------------------------
     Loading state
  ------------------------------------------------------------ */
  if (loading)
    return (
      <div className="py-10 text-center text-gray-500">
        Loading categories...
      </div>
    );

  return (
    // Main category section
    <section className="py-10 bg-bgPage">
      <div className="container">
        {/* Section heading */}
        <div className="relative text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-textPrimary inline-block relative after:content-[''] after:absolute after:left-1/2 after:-bottom-2 after:-translate-x-1/2 after:w-20 after:h-[2px] after:bg-main after:rounded-full">
            Shop by Category
          </h2>
        </div>

        {/* Responsive category grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-10 gap-2 sm:gap-3 md:gap-4">
          {/* Render each category */}
          {categories.map((cat) => (
            <Link
              href={`/${cat.slug}`} // Navigate to category page using slug
              key={cat.id} // Unique key for React list rendering
              className="group relative border border-border bg-bgSurface rounded-md p-3 flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:border-main hover:shadow-[0_4px_14px_rgba(224,125,66,0.2)]"
            >
              {/* Image wrapper */}
              <div className="relative flex justify-center items-center aspect-square w-full overflow-hidden rounded-md">
                {/* Category image */}
                <Image
                  src={
                    cat?.image
                      ? `${process.env.NEXT_PUBLIC_API_IMAGE_URL}/${cat.image}` // API image URL
                      : "/images/placeholder.png" // Fallback image
                  }
                  alt={cat.name} // Accessible alt text
                  width={200}
                  height={200}
                  placeholder="blur" // Blur-up loading effect
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/OhPPQAJJAPX8L9BHgAAAABJRU5ErkJggg=="
                  className="object-contain w-[80%] transition-transform duration-300 group-hover:scale-110 rounded-lg bg-gray-100"
                />

                {/* Hover overlay effect */}
                <div className="absolute inset-0 bg-main/0 group-hover:bg-main/5 transition-colors duration-300" />
              </div>

              {/* Category name */}
              <span
                className="mt-2 font-medium text-[10px] sm:text-xs text-textPrimary group-hover:text-main transition-colors duration-300 w-full text-center truncate"
                title={cat.name} // Full name shown on hover
              >
                {cat.name}
              </span>

              {/* Bottom underline hover animation */}
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-main transition-all duration-300 group-hover:w-2/3 rounded-full"></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

// Export component for use in pages or other components
export default CategoryGrid;
