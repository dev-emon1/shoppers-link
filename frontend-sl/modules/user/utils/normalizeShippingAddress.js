/**
 * PRIORITY:
 * 1️⃣ Saved address → order.shipping_address
 * 2️⃣ Manual checkout → order.a_s_a.billing
 */

function safeParseJSON(value) {
  if (!value) return null;
  try {
    return typeof value === "string" ? JSON.parse(value) : value;
  } catch {
    return null;
  }
}

export function normalizeShippingAddress(vendorOrder) {
  if (!vendorOrder?.order) return null;

  const order = vendorOrder.order;

  /**
   * 1️⃣ Saved shipping address (highest priority)
   */
  if (order.shipping_address) {
    const a = order.shipping_address;

    return {
      source: "saved", // debug / analytics / future use
      fullName: order.customer_name ?? "",
      phone: order.customer_number ?? "",
      line1: a.address_line1 ?? "",
      addressLine: a.address_line1 ?? "", // backward compatibility
      address: a.address_line1 ?? "",
      area: a.area ?? "",
      city: a.city ?? "",
      postalCode: a.postal_code ?? "",
      country: a.country ?? "Bangladesh",
    };
  }

  /**
   * 2️⃣ Manual checkout address (a_s_a.billing)
   */
  const parsedASA = safeParseJSON(order.a_s_a);

  if (parsedASA?.billing) {
    const b = parsedASA.billing;

    return {
      source: "manual",
      fullName: b.fullName ?? b.fullname ?? b.name ?? "",
      phone: b.phone ?? b.phoneNumber ?? "",
      line1: b.line1 ?? "",
      addressLine: b.line1 ?? "",
      address: b.line1 ?? "",
      area: b.area ?? "",
      city: b.city ?? "",
      postalCode: b.postalCode ?? "",
      country: "Bangladesh",
    };
  }

  /**
   * 3️⃣ Nothing found
   */
  return null;
}
