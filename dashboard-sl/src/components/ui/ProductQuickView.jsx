import React from "react";

const ProductQuickView = ({ product, onClose }) => {
  if (!product) return null;
  // console.log(product);

  const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
  const isDigitalProduct = product.category_id == 8 || product.category?.id == 8;
  // Parse variant attributes and handle images
  const parsedVariants =
    product.variants?.map((v) => ({
      ...v,
      attributes: v.attributes ? JSON.parse(v.attributes) : {},
      images: v.images || [],
    })) || [];

  // Collect all unique attribute keys across variants
  const attributeKeys = [
    ...new Set(parsedVariants.flatMap((v) => Object.keys(v.attributes))),
  ];

  // Total stock across variants
  const totalStock = parsedVariants.reduce(
    (total, v) => total + Number(v.stock || 0),
    0
  );

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

        <div className="flex flex-col md:flex-row gap-5 items-center md:items-start mb-4">
          {/* Product Images */}

          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-gray-800">
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
              <strong>Total Stock:</strong> {isDigitalProduct ? (
                <span className="text-green font-bold">In-stock</span>
              ) : (
                `${totalStock} pcs`
              )}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {product.images && product.images.length > 0 ? (
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
          )}
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
              {parsedVariants.map((variant) => {
                return (
                  <tr key={variant.id}>
                    <td className="px-2 py-1 border border-border">{variant.sku}</td>
                    <td className="px-2 py-1 border border-border">
                      ৳{variant.price}
                    </td>
                    {/* <td className="px-2 py-1 border border-border">
                      {variant.discount || 0}%
                    </td> */}
                    <td className="px-2 py-1 border border-border">{isDigitalProduct ? (
                      <span className="text-green-600 font-bold">In-stock</span>
                    ) : (
                      variant.stock
                    )}</td>
                    {attributeKeys.map((key) => (
                      <td key={key} className="px-2 py-1 border border-border">
                        {variant.attributes[key] || "-"}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;
