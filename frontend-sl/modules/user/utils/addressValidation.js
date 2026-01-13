export const validateAddressField = (name, value) => {
  switch (name) {
    case "address_type":
      return value ? "" : "Address type is required";

    case "address_line1":
      if (!value) return "Address is required";
      if (value.length < 5) return "Address is too short";
      return "";

    case "area":
      return value ? "" : "Area / Thana is required";

    case "city":
      return value ? "" : "City / District is required";

    case "postal_code":
      if (!value) return "Postcode is required";
      if (!/^\d{4}$/.test(value)) return "Postcode must be 4 digits";
      return "";

    // Optional field → no validation error
    case "address_line2":
      return "";

    default:
      return "";
  }
};

/**
 * Validate full form before submit
 */
export const validateAddressForm = (form) => {
  const errors = {};

  Object.keys(form).forEach((key) => {
    const error = validateAddressField(key, form[key]);
    if (error) errors[key] = error;
  });

  return errors;
};
