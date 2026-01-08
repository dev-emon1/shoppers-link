"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAddressesApi,
  addAddressApi,
  updateAddressApi,
  deleteAddressApi,
} from "@/modules/user/services/address.service";

const STORAGE_KEY = "user_addresses";

/* -------------------------
   Helpers
-------------------------- */
const loadFromStorage = () => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

const saveToStorage = (addresses) => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  }
};

/* -------------------------
   Thunks
-------------------------- */
export const fetchAddresses = createAsyncThunk(
  "address/fetch",
  async (customerId, { rejectWithValue }) => {
    try {
      const data = await getAddressesApi(customerId);
      return data;
    } catch (e) {
      return rejectWithValue("Failed to load addresses");
    }
  }
);

export const addAddress = createAsyncThunk(
  "address/add",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await addAddressApi(payload);
      return data;
    } catch (e) {
      return rejectWithValue("Failed to add address");
    }
  }
);

export const updateAddress = createAsyncThunk(
  "address/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const data = await updateAddressApi(id, payload);
      return data;
    } catch (e) {
      return rejectWithValue("Failed to update address");
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "address/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteAddressApi(id);
      return id;
    } catch {
      return rejectWithValue("Failed to delete address");
    }
  }
);

/* -------------------------
   Slice
-------------------------- */
const addressSlice = createSlice({
  name: "address",
  initialState: {
    list: loadFromStorage(),
    loading: false,
    error: null,
  },

  reducers: {
    clearAddresses: (state) => {
      state.list = [];
      sessionStorage.removeItem(STORAGE_KEY);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
        saveToStorage(state.list);
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addAddress.fulfilled, (state, action) => {
        state.list.push(action.payload);
        saveToStorage(state.list);
      })

      .addCase(updateAddress.fulfilled, (state, action) => {
        const idx = state.list.findIndex((a) => a.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
        saveToStorage(state.list);
      })

      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.list = state.list.filter((a) => a.id !== action.payload);
        saveToStorage(state.list);
      });
  },
});

export const { clearAddresses } = addressSlice.actions;
export default addressSlice.reducer;
