export const validateRegister = (formData) => {
  const errors = {};

  // detect input
  const value = formData.emailOrPhone.trim();

  const isEmail = /\S+@\S+\.\S+/.test(value);

  const bdPhoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
  const isPhone = bdPhoneRegex.test(value);

  if (!isEmail && !isPhone) {
    errors.emailOrPhone = "Enter a valid email or phone number (01XXXXXXXXX)";
  }

  if (!formData.name.trim()) {
    errors.name = "Full name is required";
  }

  if (formData.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};

export const validateLogin = (formData) => {
  const errors = {};

  const value = formData.emailOrPhone.trim();

  const isEmail = /\S+@\S+\.\S+/.test(value);
  const bdPhoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
  const isPhone = bdPhoneRegex.test(value);

  if (!isEmail && !isPhone) {
    errors.emailOrPhone = "Enter valid email or phone number";
  }

  if (formData.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  return errors;
};
