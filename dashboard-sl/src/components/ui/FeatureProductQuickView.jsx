import React from "react";

const FeatureProductQuickView = ({ product, onClose }) => {
  if (!product) return null;

  const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

  const variant = product.featured_variant
  // console.log(product);
  let parsedAttributes = {};
  try {
    parsedAttributes = typeof variant.attributes === "string"
      ? JSON.parse(variant.attributes)
      : variant.attributes || {};
  } catch (e) {
    console.warn("Failed to parse variant attributes", variant.attributes);
  }

  // Get attribute keys in correct order
  const attributeKeys = Object.keys(parsedAttributes);
  // LOGIC: Find the specific image for this variant
  const variantImgPath = product.images?.find(img => img.variant_id === product.product_variant_id)?.image_path;
  const primaryImgPath = product.images?.find(img => img.is_primary === 1)?.image_path;
  const mainImage = variantImgPath || primaryImgPath;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[90] animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-[95%] p-5 relative overflow-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-lg"
        >
          ✕
        </button>

        {/* Product Header */}

        <div className="flex  md:flex-row gap-5 items-center md:items-start mb-4">
          {/* Product Images */}

          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800">
              {product.name}
            </h2>
            <p className="text-sm text-gray-600">{product.sku}</p>
            <p className="mt-2 text-sm">
              <strong>Category:</strong>{" "}
              {product.category?.name || "N/A"}
              {product.sub_category?.name ? ` › ${product.sub_category.name}` : ""}
              {product.child_category?.name
                ? ` › ${product.child_category.name}`
                : ""}
            </p>
            {/* <p className="text-sm">
              <strong>Vendor:</strong> {product.vendor?.name || "N/A"}
            </p> */}
            {/* <p className="text-sm">
              <strong>Brand:</strong> {product.brand?.name || "N/A"}
            </p> */}
            <p className="text-sm">
              <strong>Total Stock:</strong> {variant.stock} pcs
            </p>
            {/* <p className="text-sm">
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-0.5 rounded text-xs ${product.status ? "bg-green/15 text-green" : "bg-red/15 text-red"
                  }`}
              >
                {product.status ? "Active" : "Inactive"}
              </span>
            </p> */}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {/* {product.images && product.images.length > 0 ? (
            product.images.map((img) => (
              <img
                key={img.id}
                src={`${IMAGE_URL}/${img.image_path}`}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-md border"
              />
            ))
          ) : (
            <img
              src="/placeholder.png"
              alt={product.name}
              className="w-16 h-16 object-cover rounded-md border"
            />
          )} */}
          <img
            src={mainImage ? `${IMAGE_URL}/${mainImage}` : "/placeholder.png"}
            alt={product.name}
            className="w-16 h-16 object-cover rounded-md border"
          />
        </div>
        {/* Variants Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-border text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-2 py-1 border border-border">SKU</th>
                <th className="px-2 py-1 border border-border">Price</th>
                {/* <th className="px-2 py-1 border border-border">Discount</th> */}
                <th className="px-2 py-1 border border-border">Stock</th>
                {attributeKeys.map((key) => (
                  <th key={key} className="px-2 py-1 border border-border">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-2 py-1 border border-border">{variant.sku}</td>
                <td className="px-2 py-1 border border-border">
                  ৳{variant.price}
                </td>
                {/* <td className="px-2 py-1 border border-border">
                      {variant.discount || 0}%
                    </td> */}
                <td className="px-2 py-1 border border-border">{variant.stock}</td>
                {attributeKeys.map((key) => (
                  <td key={key} className="px-2 py-1 border border-border">
                    {parsedAttributes[key] || "-"}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div >
  );
};

export default FeatureProductQuickView;
