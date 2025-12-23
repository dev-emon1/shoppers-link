// frontend_v1/modules/category/store/categoryReducer.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllCategories,
  forceRefreshCategories,
} from "../services/categoryService";

export const loadAllCategories = createAsyncThunk(
  "category/loadAllCategories",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchAllCategories();
      return data;
    } catch (err) {
      return rejectWithValue([]);
    }
  }
);

export const refreshAllCategories = createAsyncThunk(
  "category/refreshAllCategories",
  async (_, { rejectWithValue }) => {
    try {
      const data = await forceRefreshCategories();
      return data ?? [];
    } catch (err) {
      return rejectWithValue([]);
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  lastFetchedAt: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategories(state, action) {
      state.items = action.payload ?? [];
      state.lastFetchedAt = Date.now();
    },
    clearCategories(state) {
      state.items = [];
      state.lastFetchedAt = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload ?? [];
        state.lastFetchedAt = Date.now();
      })
      .addCase(loadAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.items = [];
        state.error = action.payload ?? "Failed to load categories";
      })
      .addCase(refreshAllCategories.fulfilled, (state, action) => {
        if (action.payload && action.payload.length) {
          state.items = action.payload;
          state.lastFetchedAt = Date.now();
        }
      });
  },
});

export const { setCategories, clearCategories } = categorySlice.actions;
export default categorySlice.reducer;
