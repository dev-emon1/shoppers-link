import React from "react";
import { User, MapPin, X } from "lucide-react";

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  const {
    items = [],
    unid,
    subtotal = 0,
    shipping_charge = 0,
    vendor_earning = 0,
    order: orderInfo = {},
    parsedData = {},
  } = order;

  // 🔥 Safe parsed totals
  const parsedTotals = parsedData?.totals || {};
  const parsedBilling = parsedData?.billing || {};

  // ✅ FINAL VALUES (priority: parsed → API)
  const finalShipping = parsedTotals?.shipping ?? Number(shipping_charge) ?? 0;

  const finalSubtotal = parsedTotals?.subtotal ?? Number(subtotal) ?? 0;

  const finalGrandTotal =
    parsedTotals?.grandTotal ?? Number(subtotal) + Number(shipping_charge);

  const finalName = parsedBilling?.fullName || orderInfo?.customer_name || "—";

  const finalPhone = parsedBilling?.phone || orderInfo?.customer_number || "—";

  const shippingAddress = orderInfo?.shipping_address;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[90] animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-[95%] p-5 relative overflow-auto max-h-[90vh]">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-2 py-2 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">
            Order Details - {unid}
          </h2>

          <button
            onClick={onClose}
            className="text-main hover:text-mainHover transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="px-2 md:p-2 space-y-4">
          {/* Customer & Shipping */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer */}
            <div className="bg-gray-50 rounded-xl p-3">
              <h3 className="font-bold text-md mb-3 flex items-center gap-2">
                <User size={18} /> Customer Information
              </h3>

              <div className="space-y-2 text-sm">
                <p className="flex justify-between">
                  <span>Name:</span>
                  <span>{finalName}</span>
                </p>

                <p className="flex justify-between">
                  <span>Phone:</span>
                  <span>{finalPhone}</span>
                </p>

                <p className="flex justify-between">
                  <span>Payment:</span>
                  <span className="uppercase">
                    {orderInfo?.payment_method || "COD"}
                  </span>
                </p>
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-gray-50 rounded-xl p-3">
              <h3 className="font-bold text-md mb-3 flex items-center gap-2">
                <MapPin size={18} /> Shipping Address
              </h3>

              <p className="text-sm text-gray-700">
                {[
                  parsedBilling?.line1 || shippingAddress?.address_line1,
                  parsedBilling?.area || shippingAddress?.area,
                  parsedBilling?.city || shippingAddress?.city,
                  parsedBilling?.state || shippingAddress?.state,
                  parsedBilling?.postalCode || shippingAddress?.postal_code,
                  parsedBilling?.country || shippingAddress?.country,
                ]
                  .filter(Boolean)
                  .join(", ") || "—"}
              </p>
            </div>
          </div>

          {/* Summary */}
          <div>
            <h3 className="font-bold text-md mb-2">Order Summary</h3>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-3 rounded shadow text-center">
                <p className="text-sm text-gray-500">Subtotal</p>
                <p className="font-bold text-lg">
                  ৳ {Number(finalSubtotal).toLocaleString()}
                </p>
              </div>

              <div className="bg-white p-3 rounded shadow text-center">
                <p className="text-sm text-gray-500">Shipping</p>
                <p className="font-bold text-lg">
                  ৳ {Number(finalShipping).toLocaleString()}
                </p>
              </div>

              <div className="bg-white p-3 rounded shadow text-center">
                <p className="text-sm text-gray-500">Your Earning</p>
                <p className="font-bold text-lg text-green-600">
                  ৳ {Number(vendor_earning).toLocaleString()}
                </p>
              </div>

              <div className="bg-white p-3 rounded shadow text-center">
                <p className="text-sm text-gray-500">Grand Total</p>
                <p className="font-bold text-lg text-blue-600">
                  ৳ {Number(finalGrandTotal).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="font-bold text-md mb-2">Ordered Items</h3>

            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-xl p-3 flex gap-4 items-center border"
                >
                  <img
                    src={
                      item.image?.image_path
                        ? `${import.meta.env.VITE_IMAGE_URL}/${item.image.image_path}`
                        : "/placeholder.png"
                    }
                    alt={item.product?.name}
                    className="w-20 h-20 object-cover rounded border"
                  />

                  <div className="flex justify-between w-full flex-col md:flex-row gap-3">
                    <div>
                      <h4 className="font-semibold text-sm">
                        {item.product?.name}
                      </h4>

                      <p className="text-xs text-gray-500">
                        SKU: {item.variant?.sku || "—"}
                      </p>

                      {item.variant?.attributes && (
                        <p className="text-xs text-gray-500">
                          {Object.values(
                            JSON.parse(item.variant.attributes),
                          ).join(" • ")}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-blue-600">
                        ৳ {Number(item.total).toLocaleString()}
                      </p>

                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity} × ৳{" "}
                        {Number(item.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
