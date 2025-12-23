"use client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  updateProfileApi,
  updateProfilePhotoApi,
  changePasswordApi,
} from "../services/profile.service";

// UPDATE INFO
export const updateProfile = createAsyncThunk(
  "profile/update",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await updateProfileApi(payload);
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data || "Update failed");
    }
  }
);

// UPDATE PHOTO
export const updateAvatar = createAsyncThunk(
  "profile/avatar",
  async (file, { rejectWithValue }) => {
    try {
      const data = await updateProfilePhotoApi(file);
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data || "Upload failed");
    }
  }
);

// CHANGE PASSWORD
export const changePassword = createAsyncThunk(
  "profile/changePassword",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await changePasswordApi(payload);
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data || "Failed to change");
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    loading: false,
    avatarUploading: false,
    updating: false,
    passwordUpdating: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      // Update profile info
      .addCase(updateProfile.pending, (state) => {
        state.updating = true;
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.updating = false;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      // Update avatar
      .addCase(updateAvatar.pending, (state) => {
        state.avatarUploading = true;
      })
      .addCase(updateAvatar.fulfilled, (state) => {
        state.avatarUploading = false;
        state.error = null;
      })
      .addCase(updateAvatar.rejected, (state, action) => {
        state.avatarUploading = false;
        state.error = action.payload;
      })

      // Change password
      .addCase(changePassword.pending, (state) => {
        state.passwordUpdating = true;
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

export default profileSlice.reducer;
