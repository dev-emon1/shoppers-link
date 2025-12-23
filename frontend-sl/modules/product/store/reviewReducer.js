// frontend-sl/modules/product/store/reviewReducer.js
"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchReviewsFromApi,
  submitReviewToApi,
  userHasDeliveredProduct,
} from "../services/reviewService";

// fetch reviews for product
export const fetchProductReviews = createAsyncThunk(
  "product/reviews/fetch",
  async ({ productId, params = {} }, { rejectWithValue }) => {
    try {
      const data = await fetchReviewsFromApi(productId, params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || String(err));
    }
  }
);

// submit review
export const submitProductReview = createAsyncThunk(
  "product/reviews/submit",
  async ({ productId, payload }, { rejectWithValue }) => {
    try {
      const data = await submitReviewToApi(productId, payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || String(err));
    }
  }
);

// client-side check (UI). server must re-check.
export const checkCanUserReview = createAsyncThunk(
  "product/reviews/canReview",
  async (
    { productId, variantId = null, orderId = null },
    { rejectWithValue }
  ) => {
    try {
      const res = await userHasDeliveredProduct({
        productId,
        variantId,
        orderId,
      });
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || String(err));
    }
  }
);

/**
 * Slice
 */
const initialState = {
  reviews: [],
  meta: null,
  loading: false,
  submitting: false,
  canReview: false,
  lastCheckedOrder: null,
  error: null,
};

const reviewSlice = createSlice({
  name: "productReview",
  initialState,
  reducers: {
    clearReviews(state) {
      state.reviews = [];
      state.meta = null;
      state.error = null;
    },
    resetReviewState(state) {
      state.loading = false;
      state.submitting = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload || {};
        state.reviews = payload.data || [];
        state.meta = payload.meta || null;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      });

    // submitProductReview
    builder
      .addCase(submitProductReview.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(submitProductReview.fulfilled, (state, action) => {
        state.submitting = false;
        const created =
          action.payload?.review ||
          (Array.isArray(action.payload?.data)
            ? action.payload.data[0]
            : null) ||
          null;
        if (created) {
          // prepend
          state.reviews = [created, ...state.reviews];
        }
      })
      .addCase(submitProductReview.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || action.error?.message;
      });

    // checkCanUserReview
    builder
      .addCase(checkCanUserReview.pending, (state) => {
        state.canReview = false;
        state.lastCheckedOrder = null;
      })
      .addCase(checkCanUserReview.fulfilled, (state, action) => {
        state.canReview = Boolean(action.payload?.canReview);
        state.lastCheckedOrder = action.payload?.matchedOrder || null;
      })
      .addCase(checkCanUserReview.rejected, (state) => {
        state.canReview = false;
      });
  },
});

export const { clearReviews, resetReviewState } = reviewSlice.actions;
export default reviewSlice.reducer;
