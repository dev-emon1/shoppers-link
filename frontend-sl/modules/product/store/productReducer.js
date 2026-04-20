// modules/product/store/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchProductsFromApi,
  fetchVendorProducts,
} from "../services/productServices";

/* ---------------- FETCH ALL PRODUCTS ---------------- */
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params = {}) => {
    return await fetchProductsFromApi(params);
  },
);

/* ---------------- FETCH VENDOR PRODUCTS ---------------- */
export const fetchVendorProductsThunk = createAsyncThunk(
  "products/fetchVendorProducts",
  async (params = {}) => {
    return await fetchVendorProducts(params);
  },
);

/* ---------------- INITIAL STATE ---------------- */
const initialState = {
  // ✅ GLOBAL PRODUCTS
  itemsById: {},
  list: [],
  slugMap: {},

  // ✅ VENDOR PRODUCTS (NEW)
  vendorItemsById: {},
  vendorList: [],

  meta: null,
  lastFetched: null,
  loading: false,
  error: null,
};

/* ---------------- SLICE ---------------- */
const productSlice = createSlice({
  name: "products",
  initialState,

  reducers: {
    clearProducts(state) {
      state.itemsById = {};
      state.list = [];
      state.slugMap = {};
      state.meta = null;
      state.lastFetched = null;
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers(builder) {
    builder

      /* =========================
         GLOBAL PRODUCTS
      ========================= */
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        const payload = action.payload || {};
        const items = Array.isArray(payload.data) ? payload.data : [];

        state.itemsById = {};
        state.list = [];
        state.slugMap = {};

        items.forEach((p) => {
          state.itemsById[p.id] = p;
          state.list.push(p.id);
          if (p.slug) state.slugMap[p.slug] = p.id;
        });

        state.meta = payload.meta || null;
        state.lastFetched = Date.now();
        state.loading = false;
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed to fetch products";
      })

      /* =========================
         VENDOR PRODUCTS (FIXED)
      ========================= */
      .addCase(fetchVendorProductsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchVendorProductsThunk.fulfilled, (state, action) => {
        const payload = action.payload || {};
        const items = Array.isArray(payload.data) ? payload.data : [];

        // ❌ DON'T TOUCH GLOBAL STATE
        // state.itemsById = {}
        // state.list = []

        // ✅ STORE SEPARATELY
        state.vendorItemsById = {};
        state.vendorList = [];

        items.forEach((p) => {
          state.vendorItemsById[p.id] = p;
          state.vendorList.push(p.id);
        });

        state.loading = false;
      })

      .addCase(fetchVendorProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error?.message || "Failed to fetch vendor products";
      });
  },
});

export const { clearProducts } = productSlice.actions;
export default productSlice.reducer;
