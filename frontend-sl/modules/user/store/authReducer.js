"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUserApi } from "../services/authServices";
import {
  updateProfileApi,
  updateProfilePhotoApi,
  changePasswordApi,
} from "../services/profile.service";

const AUTH_KEY = "auth";

/* ======================================================
   Load auth state from localStorage (safe)
====================================================== */
function loadAuthFromStorage() {
  if (typeof window === "undefined") {
    return { user: null, token: null };
  }

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

const stored = loadAuthFromStorage();

/* ======================================================
   THUNKS
====================================================== */

// LOGIN
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
        error?.response?.data?.message || "Invalid login credentials"
      );
    }
  }
);

// UPDATE PROFILE (name, phone)
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (payload, { rejectWithValue }) => {
    try {
      return await updateProfileApi(payload);
    } catch (err) {
      return rejectWithValue(err?.response?.data || "Update failed");
    }
  }
);

// UPDATE AVATAR
export const updateAvatar = createAsyncThunk(
  "auth/updateAvatar",
  async (file, { rejectWithValue }) => {
    try {
      return await updateProfilePhotoApi(file);
    } catch (err) {
      return rejectWithValue(err?.response?.data || "Upload failed");
    }
  }
);

// CHANGE PASSWORD
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (payload, { rejectWithValue }) => {
    try {
      return await changePasswordApi(payload);
    } catch (err) {
      return rejectWithValue(
        err?.response?.data || "Failed to change password"
      );
    }
  }
);

/* ======================================================
   AUTH SLICE (single source of truth)
====================================================== */

const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: stored.user,
    token: stored.token,
    isAuthenticated: !!stored.token,

    // UI / process states
    loading: false,
    updatingProfile: false,
    avatarUploading: false,
    passwordUpdating: false,

    error: null,
  },

  reducers: {
    // Used when token-based auth restore needed
    setUserFromToken(state, action) {
      const { user, token } = action.payload;

      state.user = user;
      state.token = token;
      state.isAuthenticated = true;

      localStorage.setItem(AUTH_KEY, JSON.stringify({ user, token }));
    },

    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem(AUTH_KEY);
    },
  },

  extraReducers: (builder) => {
    builder
      /* ================= LOGIN ================= */
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
      })

      /* ================= UPDATE PROFILE ================= */
      .addCase(updateProfile.pending, (state) => {
        state.updatingProfile = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updatingProfile = false;
        state.error = null;

        const incomingUser = action.payload.user;

        /**
         * 🔒 SAFE MERGE
         * - Never remove existing fields
         * - Especially profile_picture
         */
        state.user = {
          ...state.user,
          ...incomingUser,
          customer: {
            ...state.user?.customer,
            ...(incomingUser?.customer || {}),
          },
        };

        localStorage.setItem(
          AUTH_KEY,
          JSON.stringify({ user: state.user, token: state.token })
        );
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updatingProfile = false;
        state.error = action.payload;
      })

      /* ================= UPDATE AVATAR ================= */
      .addCase(updateAvatar.pending, (state) => {
        state.avatarUploading = true;
        state.error = null;
      })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.avatarUploading = false;
        state.error = null;

        /**
         * Backend returns:
         * {
         *   user: {
         *     customer: { profile_picture: "xxx.jpg" }
         *   }
         * }
         */
        const newPicture = action.payload?.user?.customer?.profile_picture;

        if (newPicture && state.user?.customer) {
          state.user.customer.profile_picture = newPicture;
        }

        localStorage.setItem(
          AUTH_KEY,
          JSON.stringify({ user: state.user, token: state.token })
        );
      })
      .addCase(updateAvatar.rejected, (state, action) => {
        state.avatarUploading = false;
        state.error = action.payload;
      })

      /* ================= CHANGE PASSWORD ================= */
      .addCase(changePassword.pending, (state) => {
        state.passwordUpdating = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.passwordUpdating = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.passwordUpdating = false;
        state.error = action.payload;
      });
  },
});

export const { setUserFromToken, logout } = authSlice.actions;
export default authSlice.reducer;
