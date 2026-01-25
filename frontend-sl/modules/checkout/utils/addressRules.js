export const canSaveAddress = ({ billing, existingAddresses = [] }) => {
  if (!billing?.saveAddress) {
    return { ok: false };
  }

  // 1️⃣ max 2 addresses
  if (existingAddresses.length >= 2) {
    return {
      ok: false,
      reason: "You can save maximum 2 addresses (Home & Office).",
    };
  }

  const addressType = billing.addressType || "home";

  // 2️⃣ only one per type
  const sameTypeExists = existingAddresses.some(
    (a) => a.address_type === addressType,
  );

  if (sameTypeExists) {
    return {
      ok: false,
      reason: `You already have a ${addressType} address saved.`,
    };
  }

  // 3️⃣ duplicate content
  const isDuplicate = existingAddresses.some(
    (a) =>
      a.address_line1?.trim().toLowerCase() ===
        billing.line1.trim().toLowerCase() &&
      a.area?.trim().toLowerCase() === billing.area.trim().toLowerCase() &&
      a.city?.trim().toLowerCase() === billing.city.trim().toLowerCase(),
  );

  if (isDuplicate) {
    return {
      ok: false,
      reason: "This address is already saved.",
    };
  }

  return { ok: true };
};
