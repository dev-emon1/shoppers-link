// modules/product/store/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchProductsFromApi,
  fetchVendorProducts,
} from "../services/productServices";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params = {}, thunkAPI) => {
    const res = await fetchProductsFromApi(params);
    return res;
  },
);

export const fetchVendorProductsThunk = createAsyncThunk(
  "products/fetchVendorProducts",
  async (params = {}, thunkAPI) => {
    const res = await fetchVendorProducts(params);
    return res;
  },
);

const initialState = {
  itemsById: {},
  list: [],
  slugMap: {},
  meta: null,
  lastFetched: null,
  loading: false,
  error: null,
};

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
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed to fetch products";
      })
      .addCase(fetchVendorProductsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorProductsThunk.fulfilled, (state, action) => {
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
      .addCase(fetchVendorProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error?.message || "Failed to fetch vendor products";
      });
  },
});

export const { clearProducts } = productSlice.actions;
export default productSlice.reducer;
