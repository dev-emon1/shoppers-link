"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  registerUserApi,
  verifyOtpApi,
} from "@/modules/user/services/registerServices";

// REGISTER USER
export const registerUser = createAsyncThunk(
  "register/registerUser",
  async ({ name, email, phone, password }, { rejectWithValue }) => {
    try {
      const data = await registerUserApi({ name, email, phone, password });
      console.log(data);
      return data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.error || err?.response?.data?.message
      );
    }
  }
);

// VERIFY OTP (email/phone + purpose)
export const verifyOtp = createAsyncThunk(
  "register/verifyOtp",
  async ({ email, phone, otp, purpose }, { rejectWithValue }) => {
    try {
      const data = await verifyOtpApi({ email, phone, otp, purpose });
      console.log(data);
      return data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.otp?.[0] ||
          "Invalid OTP"
      );
    }
  }
);

const registerSlice = createSlice({
  name: "register",
  initialState: {
    userId: null,
    email: null,
    phone: null,
    otpModal: false,
    loading: false,
    error: null,
    purpose: "registration",
  },
  reducers: {
    closeOtpModal(state) {
      state.otpModal = false;
    },
    setOtpPurpose(state, action) {
      state.purpose = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;

        // backend response:
        state.userId = action.payload?.user_id || null;
        state.email = action.payload?.email || null;
        state.phone = action.payload?.phone || null;
        state.purpose = action.payload?.purpose || "registration";

        state.otpModal = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { closeOtpModal, setOtpPurpose } = registerSlice.actions;
export default registerSlice.reducer;
