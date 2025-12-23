// components/product/ShippingInfoCard.jsx
import { Truck, Package, RefreshCw, CheckCircle2 } from "lucide-react";

export default function ProductShippingInfo({ shipping }) {
  const defaultShipping = {
    insideDhaka: { cost: 60, estimatedDays: "1-3" },
    outsideDhaka: { cost: 120, estimatedDays: "2-5" },
    cashOnDelivery: true,
    freeShippingThreshold: 3000,
  };

  const config = shipping
    ? {
        insideDhaka: {
          cost: shipping.insideDhaka?.cost ?? defaultShipping.insideDhaka.cost,
          estimatedDays:
            shipping.insideDhaka?.estimatedDays ??
            defaultShipping.insideDhaka.estimatedDays,
        },
        outsideDhaka: {
          cost:
            shipping.outsideDhaka?.cost ?? defaultShipping.outsideDhaka.cost,
          estimatedDays:
            shipping.outsideDhaka?.estimatedDays ??
            defaultShipping.outsideDhaka.estimatedDays,
        },
        cashOnDelivery:
          shipping.cashOnDelivery ?? defaultShipping.cashOnDelivery,
        freeShippingThreshold:
          shipping.freeShippingThreshold ??
          defaultShipping.freeShippingThreshold,
      }
    : defaultShipping;

  return (
    <div className="bg-gradient-to-r from-blue-50/10 to-indigo-50/20 border border-border space-y-4 p-4">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <Truck size={18} className="text-main" />
        Delivery Information
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div className="flex gap-3">
          <div className="w-9 h-9 bg-main/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Package size={16} className="text-main" />
          </div>
          <div>
            <div className="font-medium text-sm">Inside Dhaka</div>
            <div className="text-textLight text-xs">
              ৳{config.insideDhaka.cost} • {config.insideDhaka.estimatedDays}{" "}
              days
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-9 h-9 bg-main/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Package size={16} className="text-main" />
          </div>
          <div>
            <div className="font-medium text-sm">Outside Dhaka</div>
            <div className="text-textLight text-xs">
              ৳{config.outsideDhaka.cost} • {config.outsideDhaka.estimatedDays}{" "}
              days
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-xs font-medium py-2 border-t border-border/60">
        {/* Cash on Delivery */}
        {config.cashOnDelivery && (
          <span className="flex items-center gap-1 text-green">
            <CheckCircle2 size={14} className="text-green" />
            Cash on Delivery Available
          </span>
        )}

        {/* Free Shipping */}
        <span
          className="flex items-center gap-1 text-textLight
         font-semibold"
        >
          <Truck size={14} className="text-secondary" />
          Free Shipping over ৳{config.freeShippingThreshold}
        </span>

        {/* Return Policy */}
        <span className="flex items-center gap-1 text-textLight">
          <RefreshCw size={14} className="text-secondary" />7 days easy return
        </span>
      </div>
    </div>
  );
}
