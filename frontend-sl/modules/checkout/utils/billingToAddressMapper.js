export const mapBillingToAddressPayload = ({ billing, customerId }) => {
  return {
    customer_id: customerId,
    address_type: "home", // 🔥 required by backend
    address_line1: billing.line1,
    address_line2: null,
    area: billing.area || null,
    city: billing.city,
    state: null,
    postal_code: billing.postalCode,
    country: "Bangladesh",
    is_default: true,
  };
};
