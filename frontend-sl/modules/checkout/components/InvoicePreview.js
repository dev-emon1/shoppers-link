"use client";
import { TbCurrencyTaka } from "react-icons/tb";

const InvoicePreview = ({ order }) => {
  if (!order)
    return (
      <div className="text-center text-gray-500 py-10">
        Generating invoice preview...
      </div>
    );

  const formatAmount = (value = 0) =>
    `৳${Number(value).toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="text-gray-800">
      {/* Header */}
      <div className="mb-6 border-b border-gray-200 pb-4 flex justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-main">Invoice</h2>
          <p className="text-sm text-gray-500">
            Order ID: <span className="font-medium">{order.id}</span>
          </p>
          <p className="text-sm text-gray-500">Date: {order.date}</p>
        </div>

        <div className="text-right">
          <p className="font-semibold text-gray-700">ShoppersLink</p>
          <p className="text-sm text-gray-500">support@shopperslink.com</p>
          <p className="text-sm text-gray-500">Dhaka, Bangladesh</p>
        </div>
      </div>

      {/* Billing Info */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2 text-gray-700 uppercase text-sm tracking-wide">
          Billing Address
        </h3>
        <div className="text-sm leading-relaxed">
          <p>{order.customer.name}</p>
          <p>{order.customer.phone}</p>
          <p>{order.customer.address}</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto rounded-md border border-gray-200 mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700">
              <th className="py-2 px-3">Item</th>
              <th className="py-2 px-3 text-center">Qty</th>
              <th className="py-2 px-3 text-right">Price</th>
              <th className="py-2 px-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr
                key={idx}
                className="border-t border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="py-2 px-3">{item.name}</td>
                <td className="py-2 px-3 text-center">{item.quantity}</td>
                <td className="py-2 px-3 text-right flex items-center justify-end gap-1">
                  <TbCurrencyTaka size={12} />
                  {item.price.toLocaleString("en-BD")}
                </td>
                <td className="py-2 px-3 text-right flex items-center justify-end gap-1">
                  <TbCurrencyTaka size={12} />
                  {(item.price * item.quantity).toLocaleString("en-BD")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="text-sm text-right space-y-1 border-t pt-3">
        <p>Subtotal: {formatAmount(order.subtotal)}</p>
        <p>Shipping: {formatAmount(order.shipping)}</p>
        <p className="text-lg font-semibold text-main">
          Total: {formatAmount(order.total)}
        </p>
      </div>

      {/* Payment Info */}
      <div className="mt-6 text-sm text-gray-600 border-t border-gray-100 pt-3">
        <p>
          <span className="font-medium">Payment Method:</span>{" "}
          {order.paymentMethod}
        </p>
        <p>
          <span className="font-medium">Status:</span>{" "}
          <span
            className={`capitalize ${
              order.status === "paid"
                ? "text-green-600"
                : order.status === "pending"
                  ? "text-yellow-600"
                  : "text-red-600"
            }`}
          >
            {order.status}
          </span>
        </p>
      </div>
    </div>
  );
};

export default InvoicePreview;
