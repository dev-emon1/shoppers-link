export const mapAddressToBillingForm = (addr) => ({
  line1: addr.address_line1 || "",
  area: addr.area || "",
  city: addr.city || "",
  postalCode: addr.postal_code || "",
});
