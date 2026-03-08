export const mapCartToShippingPayload = (cartItems, billingArea) => {
  const vendors = {};

  cartItems.forEach((item) => {
    if (!vendors[item.vendor_id]) {
      vendors[item.vendor_id] = {
        vendor_id: item.vendor_id,
        area: billingArea,
        items: [],
      };
    }
    vendors[item.vendor_id].items.push({
      weight: item.weight || null,
      qty: item.qty,
      price: item.price,
    });
  });
  return {
    vendors: Object.values(vendors),
    area: billingArea,
  };
};
