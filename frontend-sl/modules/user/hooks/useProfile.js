"use client";

import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  updateProfile,
  updateAvatar,
  changePassword,
} from "@/modules/user/store/authReducer";

export function useProfile() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const saveProfile = async (form) => {
    const res = await dispatch(updateProfile(form));
    if (updateProfile.fulfilled.match(res)) {
      toast.success("Profile updated successfully!");
      return true;
    }
    toast.error(res.payload || "Failed to update profile");
    return false;
  };

  const uploadAvatar = async (file) => {
    if (!file) return false;

    const res = await dispatch(updateAvatar(file));
    if (updateAvatar.fulfilled.match(res)) {
      toast.success("Profile picture updated!");
      return true;
    }
    toast.error(res.payload || "Image upload failed");
    return false;
  };

  const updatePasswordHandler = async (passwordForm) => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return false;
    }

    const res = await dispatch(changePassword(passwordForm));
    if (changePassword.fulfilled.match(res)) {
      toast.success("Password updated!");
      return true;
    }
    toast.error(res.payload || "Password update failed");
    return false;
  };

  return {
    user: auth.user,
    updatingProfile: auth.updatingProfile,
    avatarUploading: auth.avatarUploading,
    passwordUpdating: auth.passwordUpdating,
    saveProfile,
    uploadAvatar,
    updatePasswordHandler,
  };
}
