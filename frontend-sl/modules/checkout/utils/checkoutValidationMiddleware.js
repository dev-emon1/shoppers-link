import { setBillingErrors } from "../store/billingReducer";

export const checkoutValidationMiddleware = (store) => (next) => (action) => {
  if (action.type === "checkout/goNext") {
    const { value } = store.getState().checkoutBilling;

    const errors = {};
    if (!value.fullName) errors.fullName = "Full name required";
    if (!value.phone) errors.phone = "Phone required";
    if (!value.line1) errors.line1 = "Address required";
    if (!value.city) errors.city = "City required";
    if (!value.area) errors.area = "Area required";

    if (Object.keys(errors).length) {
      store.dispatch(setBillingErrors(errors));
      return;
    }
  }
  return next(action);
};
