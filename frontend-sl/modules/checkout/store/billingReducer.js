"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addAddressApi } from "@/modules/user/services/addressService";

// 👉 new user হলে order time এ call হবে
export const saveBillingAddress = createAsyncThunk(
  "checkoutBilling/saveBillingAddress",
  async ({ billing, customerId }, { rejectWithValue }) => {
    try {
      const payload = {
        customer_id: customerId,
        address_line1: billing.line1,
        city: billing.city,
        state: billing.area,
        postal_code: billing.postalCode,
        country: "Bangladesh",
        is_default: true,
      };
      return await addAddressApi(payload);
    } catch (e) {
      return rejectWithValue(e?.response?.data || "Billing save failed");
    }
  }
);

const initialState = {
  value: {
    fullName: "",
    phone: "",
    email: "",
    line1: "",
    city: "",
    area: "",
    postalCode: "",
    notes: "",
  },
  errors: {},
  hydrated: false,
  saving: false,
};

const billingSlice = createSlice({
  name: "checkoutBilling",
  initialState,
  reducers: {
    hydrateBilling(state, action) {
      if (state.hydrated) return;
      state.value = { ...state.value, ...action.payload };
      state.hydrated = true;
    },
    updateBilling(state, action) {
      state.value = action.payload;
    },
    setBillingErrors(state, action) {
      state.errors = action.payload || {};
    },
    resetBilling() {
      return initialState;
    },
  },
  extraReducers: (b) => {
    b.addCase(saveBillingAddress.pending, (s) => {
      s.saving = true;
    })
      .addCase(saveBillingAddress.fulfilled, (s) => {
        s.saving = false;
      })
      .addCase(saveBillingAddress.rejected, (s) => {
        s.saving = false;
      });
  },
});

export const { hydrateBilling, updateBilling, setBillingErrors, resetBilling } =
  billingSlice.actions;

export default billingSlice.reducer;
