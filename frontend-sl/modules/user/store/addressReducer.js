import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAddressesApi,
  addAddressApi,
  updateAddressApi,
} from "@/modules/user/services/addressService";

/* ==============================
   Cache config (Chaldal-style)
================================ */
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

const initialState = {
  list: [],
  loading: false,
  error: null,

  lastFetchedAt: null,
  cachedCustomerId: null,
};

/* ==============================
   THUNKS (inline, no extra file)
================================ */

/**
 * Fetch addresses with smart caching
 */
export const fetchAddresses = createAsyncThunk(
  "address/fetch",
  async (customerId, { getState, rejectWithValue }) => {
    const { address } = getState();

    const now = Date.now();
    const isSameCustomer = address.cachedCustomerId === customerId;
    const isCacheValid =
      address.lastFetchedAt && now - address.lastFetchedAt < CACHE_TTL;

    // 🚀 Serve from cache
    if (isSameCustomer && isCacheValid) {
      return {
        fromCache: true,
        data: address.list,
      };
    }

    try {
      const res = await getAddressesApi(customerId);
      return {
        fromCache: false,
        data: res.data,
        customerId,
        fetchedAt: now,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load addresses"
      );
    }
  }
);

/**
 * Add new address
 */
export const addAddress = createAsyncThunk(
  "address/add",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await addAddressApi(payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add address"
      );
    }
  }
);

/**
 * Update address
 */
export const updateAddress = createAsyncThunk(
  "address/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await updateAddressApi(id, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update address"
      );
    }
  }
);

/* ==============================
   SLICE
================================ */

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    clearAddressError(state) {
      state.error = null;
    },
    invalidateAddressCache(state) {
      state.lastFetchedAt = null;
      state.cachedCustomerId = null;
    },
    clearAddresses(state) {
      state.list = [];
      state.loading = false;
      state.error = null;
      state.lastFetchedAt = null;
      state.cachedCustomerId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ---------- FETCH ---------- */
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.fromCache) return;

        state.list = action.payload.data;
        state.cachedCustomerId = action.payload.customerId;
        state.lastFetchedAt = action.payload.fetchedAt;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- ADD ---------- */
      .addCase(addAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.loading = false;
        const newAddress = action.payload;

        // Default address consistency
        if (newAddress.is_default) {
          state.list = state.list.map((addr) => ({
            ...addr,
            is_default: false,
          }));
        }

        state.list.unshift(newAddress);

        // Update cache timestamp (mutation = fresh data)
        state.lastFetchedAt = Date.now();
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- UPDATE ---------- */
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;

        state.list = state.list.map((addr) => {
          if (updated.is_default && addr.id !== updated.id) {
            return { ...addr, is_default: false };
          }
          return addr.id === updated.id ? updated : addr;
        });

        state.lastFetchedAt = Date.now();
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAddressError, invalidateAddressCache, clearAddresses } =
  addressSlice.actions;

export default addressSlice.reducer;
