"use client";

import { useSelector, useDispatch } from "react-redux";
import { Camera, Mail, Phone, User, Lock, Calendar } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  updateProfile,
  updateAvatar,
  changePassword,
} from "@/modules/user/store/profileReducer";
import { setUserFromToken } from "@/modules/user/store/authReducer";
import { IMAGE_URL } from "@/core/api/axiosClient";

export default function ProfilePage() {
  const { user } = useSelector((state) => state.auth);
  const profileState = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  const [profileImage, setProfileImage] = useState(null);
  const [form, setForm] = useState({
    name: user?.user_name || "",
    email: user?.email,
    phone: user?.phone || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileImage(URL.createObjectURL(file));

    const result = await dispatch(updateAvatar(file));
    if (updateAvatar.fulfilled.match(result)) {
      toast.success("Profile picture updated!");

      // Refresh user info
      // dispatch(setUserFromToken(result.payload));
    } else {
      toast.error("Upload failed");
    }
  };

  const handleProfileSave = async () => {
    const result = await dispatch(updateProfile(form));
    if (updateProfile.fulfilled.match(result)) {
      toast.success("Profile updated successfully!");

      // dispatch(setUserFromToken(result.payload));
    } else {
      toast.error(result.payload?.message || "Failed to update");
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    const result = await dispatch(changePassword(passwordForm));
    if (changePassword.fulfilled.match(result)) {
      toast.success("Password updated!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      toast.error(result.payload?.message || "Password update failed");
    }
  };
  const avatarSrc = profileImage
    ? profileImage  // This is the local blob preview from the file input
    : user?.customer?.profile_picture
      ? `${IMAGE_URL}/avatars/${user.customer.profile_picture}`
      : "/default-avatar.png";
  return (
    <div className="space-y-10">
      {/* HEADER BLOCK */}
      <div className="bg-gradient-to-r from-main to-mainHover text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="flex items-center gap-6 relative z-10">
          {/* PROFILE IMAGE */}
          <div className="relative">
            <Image
              src={avatarSrc}
              width={110}
              height={110}
              className="rounded-full border-4 border-white shadow-md object-cover"
              alt="Profile"
            />

            <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full cursor-pointer shadow">
              <Camera size={16} className="text-main" />
              <input type="file" onChange={handleImageUpload} hidden />
            </label>
          </div>

          {/* NAME + INFO */}
          <div className="text-white space-y-1">
            <h1 className="text-2xl font-semibold">{user?.user_name}</h1>
            <p className="flex items-center gap-2 opacity-90">
              <Mail size={16} /> {user?.email}
            </p>
            <p className="flex items-center gap-2 opacity-90">
              <Phone size={16} /> {user?.phone || "No phone added"}
            </p>
          </div>
        </div>
      </div>

      {/* EDITABLE PROFILE FORM */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border space-y-8">
        <h2 className="text-xl font-semibold">Edit Profile Information</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* NAME */}
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 text-gray-400 -translate-y-1/2"
              />
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full py-3 pl-10 pr-3 border rounded-lg mt-1 focus:ring-main focus:border-main outline-none"
              />
            </div>
          </div>

          {/* EMAIL (disabled) */}
          <div>
            <label className="text-sm font-medium">Email (locked)</label>
            <div className="relative opacity-70">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 text-gray-400 -translate-y-1/2"
              />
              <input
                type="text"
                value={form.email}
                disabled
                className="w-full py-3 pl-10 pr-3 border rounded-lg mt-1 bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          {/* PHONE */}
          <div>
            <label className="text-sm font-medium">Phone Number</label>
            <div className="relative">
              <Phone
                size={18}
                className="absolute left-3 top-1/2 text-gray-400 -translate-y-1/2"
              />
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full py-3 pl-10 pr-3 border rounded-lg mt-1 focus:ring-main focus:border-main outline-none"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleProfileSave}
          className="bg-main text-white px-6 py-3 rounded-lg font-medium hover:bg-mainHover transition"
        >
          {profileState?.updating ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* PASSWORD CHANGE */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border space-y-8">
        <h2 className="text-xl font-semibold">Change Password</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* CURRENT PASSWORD */}
          <div>
            <label className="text-sm font-medium">Current Password</label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 text-gray-400 -translate-y-1/2"
              />
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full py-3 pl-10 pr-3 border rounded-lg mt-1"
              />
            </div>
          </div>

          {/* NEW PASSWORD */}
          <div>
            <label className="text-sm font-medium">New Password</label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 text-gray-400 -translate-y-1/2"
              />
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
                className="w-full py-3 pl-10 pr-3 border rounded-lg mt-1"
              />
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="text-sm font-medium">Confirm New Password</label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 text-gray-400 -translate-y-1/2"
              />
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full py-3 pl-10 pr-3 border rounded-lg mt-1"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handlePasswordUpdate}
          className="bg-main text-white px-6 py-3 rounded-lg font-medium hover:bg-mainHover transition"
        >
          {profileState?.passwordUpdating ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
}
