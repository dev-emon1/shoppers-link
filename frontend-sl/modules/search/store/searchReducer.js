// modules/search/store/searchReducer.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchProductsApi } from "../services/searchService";

export const loadSearchResults = createAsyncThunk(
  "search/loadSearchResults",
  async ({ q = "" } = {}, { signal, rejectWithValue }) => {
    try {
      const items = await searchProductsApi({ q, signal });
      return items ?? [];
    } catch (err) {
      // if aborted, return a special reject marker (we'll handle in extraReducers)
      if (
        err?.name === "AbortError" ||
        String(err).toLowerCase().includes("aborted")
      ) {
        // throw so action is rejected with AbortError info
        throw err;
      }
      return rejectWithValue(err?.message ?? "Failed to search");
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  lastQuery: "",
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clearSearch(state) {
      state.items = [];
      state.loading = false;
      state.error = null;
      state.lastQuery = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadSearchResults.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.lastQuery = action?.meta?.arg?.q ?? "";
      })
      .addCase(loadSearchResults.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload ?? [];
      })
      .addCase(loadSearchResults.rejected, (state, action) => {
        // If aborted (external signal), do NOT set an error message for the user.
        const isAbort =
          (action.error &&
            (action.error.name === "AbortError" ||
              String(action.error.message || "")
                .toLowerCase()
                .includes("aborted"))) ||
          (action?.payload === undefined &&
            action?.error?.message &&
            String(action.error.message).toLowerCase().includes("abort"));

        state.loading = false;
        if (!isAbort) {
          state.error =
            action.payload ?? action.error?.message ?? "Search failed";
        } else {
          // keep previous items (if any) and clear error
          state.error = null;
        }
      });
  },
});

export const { clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
