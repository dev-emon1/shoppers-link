// modules/checkout/utils/validation.js
// Vanilla JS validators for checkout (client & server friendly)

function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}
function isNumericPositive(n) {
  return typeof n === "number" && Number.isFinite(n) && n >= 0;
}
function isIntegerPositive(n) {
  return Number.isInteger(n) && n > 0;
}
const PHONE_BD_REGEX = /^(?:\+?88)?01[3-9]\d{8}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CARD_NUMBER_REGEX = /^\d{13,19}$/; // basic numeric length check
const CVV_REGEX = /^\d{3,4}$/;
const EXP_MONTH_REGEX = /^(0?[1-9]|1[0-2])$/;
const EXP_YEAR_REGEX = /^\d{4}$/; // full year (e.g., 2027)

export function validateBilling(billing = {}) {
  const errors = {};
  const safe = (s) => (typeof s === "string" ? s.trim() : "");

  if (!isNonEmptyString(safe(billing.fullName))) {
    errors.fullName = "Full name is required";
  } else if (safe(billing.fullName).length < 2) {
    errors.fullName = "Full name is too short";
  }

  if (!isNonEmptyString(safe(billing.phone))) {
    errors.phone = "Phone number is required";
  } else if (!PHONE_BD_REGEX.test(safe(billing.phone))) {
    errors.phone = "Enter a valid mobile number";
  }

  if (billing.email) {
    if (!EMAIL_REGEX.test(String(billing.email).trim())) {
      errors.email = "Enter a valid email address";
    }
  }

  if (!isNonEmptyString(safe(billing.line1))) {
    errors.line1 = "Address line is required";
  }
  if (!isNonEmptyString(safe(billing.city))) {
    errors.city = "City is required";
  }
  if (!isNonEmptyString(safe(billing.area))) {
    errors.area = "Area is required";
  }
  if (billing.postalCode) {
    if (!/^[0-9A-Za-z\-\s]{3,10}$/.test(String(billing.postalCode).trim())) {
      errors.postalCode = "Invalid postal code";
    }
  }

  return errors;
}

export function validateShipping(shipping = {}) {
  const errors = {};
  if (!shipping) {
    errors.shipping = "Select a shipping option";
    return errors;
  }
  if (typeof shipping === "object") {
    if (!shipping.id && !shipping.code) {
      errors.shipping = "Invalid shipping option";
    }
  } else {
    // if shipping is primitive (id) ensure truthy
    if (!shipping) errors.shipping = "Select a shipping option";
  }
  return errors;
}

export function validatePayment(payment = {}) {
  // payment might be a string id (e.g., 'cod') or object
  const errors = {};
  const selected =
    typeof payment === "string"
      ? payment
      : payment?.method || payment?.selected;
  if (!selected) {
    errors.payment = "Select a payment method";
    return errors;
  }
  const allowed = ["cod", "bkash", "card"];
  if (!allowed.includes(selected)) {
    errors.payment = "Unsupported payment method";
  }
  // if card, validate card details shape (client-side basic)
  if (selected === "card") {
    const card = payment.card || {};
    if (!card) {
      errors.payment = "Card details required";
      return errors;
    }
    if (
      !card.number ||
      !CARD_NUMBER_REGEX.test(String(card.number).replace(/\s+/g, ""))
    ) {
      errors.cardNumber = "Invalid card number";
    }
    if (!EXP_MONTH_REGEX.test(String(card.expMonth))) {
      errors.cardExpMonth = "Invalid expiry month";
    }
    if (!EXP_YEAR_REGEX.test(String(card.expYear))) {
      errors.cardExpYear = "Invalid expiry year";
    } else {
      // optional: ensure expiry not in past
      const y = Number(card.expYear);
      const m = Number(card.expMonth) || 1;
      const now = new Date();
      const exp = new Date(y, m - 1, 1);
      if (exp <= new Date(now.getFullYear(), now.getMonth(), 1)) {
        errors.cardExpiry = "Card expiry is in the past";
      }
    }
    if (!CVV_REGEX.test(String(card.cvv || ""))) {
      errors.cardCvv = "Invalid CVV";
    }
    // not storing or sending card sensitive data: recommend tokenization via gateway
  }
  return errors;
}

export function validateCoupon(coupon = "") {
  const errors = {};
  if (!coupon) return errors;
  if (typeof coupon !== "string" || coupon.length > 64) {
    errors.coupon = "Invalid coupon code";
  }
  // server must validate actual coupon existence/expiry/amount
  return errors;
}

export function validateOrderPayload(
  payload = {},
  opts = { supportedPayments: ["cod", "bkash", "card"] }
) {
  const errors = {};

  if (!payload || typeof payload !== "object") {
    errors.payload = "Invalid order payload";
    return errors;
  }

  // items must be array
  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    errors.items = "Order must contain at least one item";
    return errors;
  }

  const itemErrors = [];
  payload.items.forEach((it, idx) => {
    const ie = {};
    if (!it) {
      itemErrors[idx] = { _error: "Invalid item" };
      return;
    }
    if (!isNonEmptyString(it.id) && !isNonEmptyString(it.sku)) {
      ie.id = "Missing product id/sku";
    }
    if (!isNonEmptyString(it.name)) ie.name = "Missing product name";
    if (!isIntegerPositive(it.quantity))
      ie.quantity = "Quantity must be a positive integer";
    if (!isNumericPositive(Number(it.price))) ie.price = "Invalid price";
    // optional: client might send lineTotal; check consistency if present
    if (typeof it.lineTotal !== "undefined") {
      const computed = Number(Number(it.price) * Number(it.quantity) || 0);
      // allow small rounding epsilon
      if (Math.abs(Number(it.lineTotal) - computed) > 0.01) {
        ie.lineTotal = "Line total mismatch";
      }
    }
    if (Object.keys(ie).length) itemErrors[idx] = ie;
  });
  if (itemErrors.length) errors.items = itemErrors;

  // total sanity check: server must recalc actual total
  if (typeof payload.total !== "number" || !Number.isFinite(payload.total)) {
    errors.total = "Invalid total amount";
  } else if (payload.total < 0) {
    errors.total = "Total cannot be negative";
  }

  // payment method check
  if (!isNonEmptyString(payload.paymentMethod)) {
    errors.paymentMethod = "Payment method required";
  } else if (!opts.supportedPayments.includes(payload.paymentMethod)) {
    errors.paymentMethod = "Unsupported payment method";
  }

  // billing and shipping basics (client-side checks)
  if (!payload.billing || typeof payload.billing !== "object") {
    errors.billing = "Billing information required";
  } else {
    const bErr = validateBilling(payload.billing);
    if (Object.keys(bErr).length) errors.billing = bErr;
  }

  if (!payload.shipping) {
    errors.shipping = "Shipping information required";
  } else {
    const sErr = validateShipping(payload.shipping);
    if (Object.keys(sErr).length) errors.shipping = sErr;
  }

  // coupon (format only)
  if (payload.coupon) {
    const cErr = validateCoupon(payload.coupon);
    if (Object.keys(cErr).length) errors.coupon = cErr;
  }

  return errors;
}
