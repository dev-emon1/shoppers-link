import React, { useState, useMemo, useCallback } from "react";
import Table from "../../../components/table/Table";
import StatusBadge from "../../../components/common/StatusBadge";
import TableActions from "../../../components/table/TableActions";
import SlidePanel from "../../../components/common/SlidePanel";
import ImageUploader from "../../../components/common/ImageUploader";
import PageHeader from "../../../components/common/PageHeader";
import Pagination from "../../../components/Pagination";
import FilterBar from "../../../components/common/FilterBar";
import { brandData } from "../../../data/admin/product-management/dummyData";

const Brand = React.memo(() => {
  // ==== States ====
  const [show, setShow] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [brandName, setBrandName] = useState("");
  const [brandDetails, setBrandDetails] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [brands, setBrands] = useState(brandData);

  // ==== Handlers ====
  const handleFileSelect = useCallback((file) => setImageFile(file), []);
  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  }, []);
  const handlePerPageChange = useCallback((e) => {
    setPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!brandName.trim()) return alert("⚠️ Brand name is required!");
      if (!imageFile) return alert("⚠️ Please upload an image!");

      const newBrand = {
        id: crypto.randomUUID?.() || Date.now(),
        name: brandName.trim(),
        image: URL.createObjectURL(imageFile),
        productCount: 0,
        status: "active",
        description: brandDetails.trim() || "",
      };

      setBrands((prev) => [...prev, newBrand]);
      console.log("✅ New Brand Added:", newBrand);

      setBrandName("");
      setBrandDetails("");
      setImageFile(null);
      setShow(false);
      alert("✅ Brand added successfully!");
    },
    [brandName, brandDetails, imageFile]
  );

  // ==== Filter + Pagination ====
  const { currentData, totalPages } = useMemo(() => {
    let filtered = brands;
    if (searchTerm.trim()) {
      filtered = filtered.filter((brand) =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const total = Math.ceil(filtered.length / perPage);
    const start = (page - 1) * perPage;
    const current = filtered.slice(start, start + perPage);

    return { currentData: current, totalPages: total };
  }, [brands, searchTerm, perPage, page]);

  // ==== Table Columns ====
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
          src={item.image}
          alt={item.name}
          className="w-10 h-10 rounded object-cover border border-border"
        />
      ),
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      className: "font-medium text-gray-800 capitalize",
    },
    {
      key: "productCount",
      label: "Products",
      className: "text-center hidden sm:table-cell",
    },
    {
      key: "status",
      label: "Status",
      render: (item) => <StatusBadge status={item.status} />,
      className: "text-center hidden md:table-cell",
    },
    {
      key: "actions",
      label: "Actions",
      render: () => <TableActions />,
      className: "text-center",
    },
  ];

  return (
    <div className="px-4">
      {/* ==== Page Header ==== */}
      <PageHeader
        title="Brands"
        searchTerm={searchTerm}
        onSearch={handleSearch}
        onAddClick={() => setShow(true)}
        addLabel="Add Brand"
        rightActions={
          <>
            <button className="border border-border text-gray-700 text-sm px-3 py-1.5 rounded-md hover:bg-gray-50 transition">
              Export CSV
            </button>
            <button className="border border-border text-gray-700 text-sm px-3 py-1.5 rounded-md hover:bg-gray-50 transition">
              Import Excel
            </button>
          </>
        }
      />

      {/* ==== FilterBar (optional future filters) ==== */}
      <div className="mb-4 bg-white p-3 rounded-md shadow-sm">
        <FilterBar
          perPage={perPage}
          onPerPageChange={handlePerPageChange}
          onFilterChange={() => {}}
        />
      </div>

      {/* ==== Table Section ==== */}
      <div className="flex flex-wrap w-full">
        <div className="w-full lg:w-7/12">
          <div className="bg-white p-4 rounded-md shadow-md overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            <Table
              columns={columns}
              data={currentData}
              page={page}
              perPage={perPage}
              enableCheckbox={true}
              showFooter={true}
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

        {/* ==== Add Brand SlidePanel ==== */}
        <SlidePanel
          show={show}
          title="Add New Brand"
          onClose={() => setShow(false)}
        >
          <form onSubmit={handleSubmit}>
            {/* Brand Name */}
            <div className="flex flex-col w-full gap-1 mb-5">
              <label className="text-sm font-medium mb-1">
                Brand Name <span className="text-red">*</span>
              </label>
              <input
                type="text"
                className="px-3 py-2 border border-border rounded-md outline-none focus:ring-1 focus:ring-main text-sm"
                placeholder="Enter brand name"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="flex flex-col w-full gap-1 mb-5">
              <label className="text-sm font-medium mb-1">
                Description (optional)
              </label>
              <textarea
                className="px-3 py-2 border border-border rounded-md outline-none focus:ring-1 focus:ring-main text-sm resize-none"
                placeholder="Enter brand details"
                value={brandDetails}
                onChange={(e) => setBrandDetails(e.target.value)}
                rows={3}
              />
            </div>

            {/* Image Upload */}
            <div className="max-w-md mx-auto mt-6">
              <label className="text-sm font-medium mb-1">
                Brand Image <span className="text-red">*</span>
              </label>
              <ImageUploader onFileSelect={handleFileSelect} multiple={false} />
            </div>

            {/* Submit */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={!brandName || !imageFile}
                className={`w-full rounded-md px-7 py-2 text-white text-sm font-medium transition-all ${
                  !brandName || !imageFile
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-main hover:bg-mainHover"
                }`}
              >
                Add Brand
              </button>
            </div>
          </form>
        </SlidePanel>
      </div>
    </div>
  );
});

export default Brand;
