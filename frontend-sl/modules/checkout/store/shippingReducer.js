"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { calculateShippingApi } from "../services/shipping.service";

export const fetchShippingCharge = createAsyncThunk(
  "checkoutShipping/fetchShippingCharge",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await calculateShippingApi(payload);
      return res;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Shipping failed");
    }
  },
);

const initialState = {
  shippingFee: 0,
  grandTotal: 0,
  loading: false,
  error: null,
};

const shippingSlice = createSlice({
  name: "checkoutShipping",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShippingCharge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShippingCharge.fulfilled, (state, action) => {
        state.loading = false;
        state.shippingFee = action.payload.summary.delivery_fee;
        state.grandTotal = action.payload.summary.grand_total;
      })
      .addCase(fetchShippingCharge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.shippingFee = 120;
      });
  },
});

export default shippingSlice.reducer;
