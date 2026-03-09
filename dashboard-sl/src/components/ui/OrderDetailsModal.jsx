import React from "react";
import { X, User, MapPin, Package } from "lucide-react";
import { format } from "date-fns";

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  // ==============================
  // Parse billing & shipping info
  // ==============================

  let billing = {};
  let shippingType = "inside";
  let totals = {};

  try {
    const asaStr = order?.a_s_a;

    if (asaStr) {
      const parsed = typeof asaStr === "string" ? JSON.parse(asaStr) : asaStr;

      billing = parsed?.billing || {};
      shippingType = parsed?.shipping?.label || parsed?.shipping || "inside";
      totals = parsed?.totals || {};
    }
  } catch (err) {
    console.warn("Failed to parse a_s_a:", err);
  }

  // ==============================
  // Total items
  // ==============================

  const totalItems =
    order.vendor_orders?.reduce((sum, vo) => sum + (vo.item_count || 0), 0) ||
    0;

  // ==============================
  // Grand total
  // ==============================

  const displayGrandTotal = totals?.grandTotal || order.total_amount || 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto">
        {/* Header */}

        <div className="sticky top-0 z-10 bg-white border-b px-6 py-3 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Order Details</h2>

            <p className="text-lg font-mono text-orange-500 mt-1">
              {order.unid}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Customer + Address */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Customer */}

            <div className="bg-gray-50 rounded-xl p-3 border">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <User size={18} /> Customer
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name</span>

                  <span className="font-medium">{billing.fullName || "—"}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Phone</span>

                  <span className="font-medium">{billing.phone || "—"}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>

                  <span className="font-medium">{billing.email || "—"}</span>
                </div>
              </div>
            </div>

            {/* Shipping */}

            <div className="bg-gray-50 rounded-xl p-3 border">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <MapPin size={18} /> Shipping Address
              </h3>

              <div className="text-sm text-gray-700">
                {billing.line1 && <p>{billing.line1}</p>}

                {(billing.area || billing.city) && (
                  <p>
                    {billing.area && `${billing.area}, `}
                    {billing.city}
                    {billing.postalCode && ` - ${billing.postalCode}`}
                  </p>
                )}

                {!billing.line1 && !billing.city && (
                  <p className="text-gray-500">— No address provided —</p>
                )}
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Shipping: <span className="font-medium">{shippingType}</span>
              </p>
            </div>
          </div>

          {/* Order Summary */}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white border rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500 uppercase">Items</p>

              <p className="text-xl font-bold text-indigo-600 mt-1">
                {totalItems}
              </p>
            </div>

            <div className="bg-white border rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500 uppercase">Payment</p>

              <p className="text-xl font-bold uppercase mt-1">
                {order.payment_method?.toUpperCase() || "COD"}
              </p>
            </div>

            <div className="bg-white border rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500 uppercase">Order Date</p>

              <p className="text-md font-medium mt-1">
                {format(new Date(order.created_at), "dd MMM yyyy")}
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
              <p className="text-xs text-green-700 uppercase">Grand Total</p>

              <p className="text-xl font-bold text-green-700 mt-1">
                ৳ {Number(displayGrandTotal).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Ordered Items */}

          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Package size={18} /> Ordered Items
            </h3>

            {order.vendor_orders?.length > 0 ? (
              order.vendor_orders.map((vo, voIndex) => (
                <div key={vo.id} className="mb-4">
                  {order.vendor_orders.length > 1 && (
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Vendor Order #{voIndex + 1} • {vo.unid}
                    </p>
                  )}

                  <div className="space-y-3">
                    {vo.items?.map((item) => {
                      const product = item.product || {};
                      const variant = item.variant || {};

                      let attributes = {};

                      try {
                        attributes = variant.attributes
                          ? JSON.parse(variant.attributes)
                          : {};
                      } catch {}

                      return (
                        <div
                          key={item.id}
                          className="flex gap-3 p-3 bg-gray-50 rounded-xl border"
                        >
                          {/* Product Image */}

                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                            {product.primary_image ? (
                              <img
                                src={`${import.meta.env.VITE_IMAGE_URL}/${product.primary_image}`}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) =>
                                  (e.target.src = "/placeholder.jpg")
                                }
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Package size={24} />
                              </div>
                            )}
                          </div>

                          {/* Info */}

                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">
                              {product.name || "Product"}
                            </h4>

                            <p className="text-xs text-gray-500">
                              SKU: {product.sku || variant.sku || "—"}
                            </p>

                            {/* Variant Attributes */}

                            {Object.keys(attributes).length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {Object.entries(attributes).map(
                                  ([key, value]) => (
                                    <span
                                      key={key}
                                      className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-xs"
                                    >
                                      {key}: {value}
                                    </span>
                                  ),
                                )}
                              </div>
                            )}

                            <div className="mt-2 text-sm text-gray-600">
                              Qty:{" "}
                              <span className="font-semibold">
                                {item.quantity}
                              </span>{" "}
                              × ৳ {Number(item.price).toLocaleString()}
                            </div>
                          </div>

                          {/* Price */}

                          <div className="font-bold text-green-700">
                            ৳{" "}
                            {Number(
                              item.total || item.price * item.quantity,
                            ).toLocaleString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                No items found in this order
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
