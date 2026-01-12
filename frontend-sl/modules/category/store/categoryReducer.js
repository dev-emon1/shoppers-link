import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllCategoriesApi } from "../services/categoryService";
import { readCategoryCache, writeCategoryCache } from "../utils/categoryCache";

const CATEGORY_TTL = 24 * 60 * 60 * 1000; // 24h

export const loadAllCategories = createAsyncThunk(
  "category/loadAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      // 🔹 1. Redux state cache check
      const state = getState().category;
      if (
        state.items.length > 0 &&
        state.lastFetched &&
        Date.now() - state.lastFetched < state.ttl
      ) {
        // Already fresh in Redux
        return state.items;
      }

      // 🔹 2. sessionStorage cache check
      const cached = readCategoryCache();
      if (cached && Array.isArray(cached)) {
        return cached; // instant return, no API
      }

      // 🔹 3. Network call (last resort)
      const data = await fetchAllCategoriesApi();

      // 🔹 4. Write to session cache
      writeCategoryCache(data);

      return data;
    } catch (e) {
      return rejectWithValue("Failed to load categories");
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    items: [],
    status: "idle", // idle | loading | success | error
    lastFetched: null,
    ttl: CATEGORY_TTL,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadAllCategories.pending, (state) => {
        // ⚠️ only show loading if empty
        if (state.items.length === 0) {
          state.status = "loading";
        }
      })
      .addCase(loadAllCategories.fulfilled, (state, action) => {
        state.status = "success";
        state.items = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(loadAllCategories.rejected, (state) => {
        state.status = "error";
      });
  },
});

export default categorySlice.reducer;
