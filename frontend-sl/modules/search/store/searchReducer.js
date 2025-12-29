// modules/search/store/searchReducer.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchProductsApi } from "../services/searchService";

export const loadSearchResults = createAsyncThunk(
  "search/loadSearchResults",
  async (
    { q, categoryId = null, limit = null },
    { signal, rejectWithValue }
  ) => {
    try {
      const result = await searchProductsApi({
        q,
        categoryId,
        limit,
        signal,
      });
      return result;
    } catch (err) {
      if (err.name === "CanceledError") {
        throw err;
      }
      return rejectWithValue(err.message || "Search failed");
    }
  }
);

const initialState = {
  query: "",
  categoryId: null,
  items: [],
  total: 0,
  status: "idle", // idle | loading | success | error
  error: null,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.query = action.payload;
    },
    setSearchCategory(state, action) {
      state.categoryId = action.payload;
    },
    clearSearch(state) {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadSearchResults.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadSearchResults.fulfilled, (state, action) => {
        state.status = "success";
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(loadSearchResults.rejected, (state, action) => {
        if (action.error?.name === "CanceledError") return;
        state.status = "error";
        state.error = action.payload;
      });
  },
});

export const { setSearchQuery, setSearchCategory, clearSearch } =
  searchSlice.actions;

export default searchSlice.reducer;
