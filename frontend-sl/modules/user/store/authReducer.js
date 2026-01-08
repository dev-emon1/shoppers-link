"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUserApi } from "../services/authServices";

const AUTH_KEY = "auth";

/* Load auth state from localStorage */
function loadAuthFromStorage() {
  if (typeof window === "undefined") return { user: null, token: null };
  try {
    return (
      JSON.parse(localStorage.getItem(AUTH_KEY)) || {
        user: null,
        token: null,
      }
    );
  } catch {
    return { user: null, token: null };
  }
}

/* ============================
      LOGIN THUNK
=============================== */
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, phone, password }, { rejectWithValue }) => {
    try {
      const data = await loginUserApi({
        email,
        phone,
        password,
        type: "customer",
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Invalid login credentials. Please check your email/phone or password."
      );
    }
  }
);

const stored = loadAuthFromStorage();

/* ============================
        AUTH SLICE
=============================== */
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: stored.user,
    token: stored.token,
    isAuthenticated: !!stored.token,
    loading: false,
    error: null,
  },

  reducers: {
    setUserFromToken: (state, action) => {
      const { user, token } = action.payload;

      state.user = user;
      state.token = token;
      state.isAuthenticated = true;

      localStorage.setItem(AUTH_KEY, JSON.stringify({ user, token }));
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem(AUTH_KEY);
    },
  },

  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;

        localStorage.setItem(
          AUTH_KEY,
          JSON.stringify({
            user: action.payload.user,
            token: action.payload.token,
          })
        );
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { setUserFromToken, logout } = authSlice.actions;
export default authSlice.reducer;
