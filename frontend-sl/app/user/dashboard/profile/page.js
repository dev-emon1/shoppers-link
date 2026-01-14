"use client";

import { Camera, Mail, Phone, User, Lock } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useProfile } from "@/modules/user/hooks/useProfile";
import { makeImageUrl } from "@/lib/utils/image";

export default function ProfilePage() {
  const {
    user,
    updatingProfile,
    avatarUploading,
    passwordUpdating,
    saveProfile,
    uploadAvatar,
    updatePasswordHandler,
  } = useProfile();

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

    // local preview (same as before)
    setProfileImage(URL.createObjectURL(file));
    await uploadAvatar(file);
  };

  const avatarSrc = profileImage
    ? profileImage
    : makeImageUrl(user?.customer?.profile_picture);

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
              {user?.email && <Mail size={16} />}
            </p>
            <p className="flex items-center gap-2 opacity-90">
              <Phone size={16} /> {user?.phone || "No phone added"}
            </p>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE */}
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

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium">Email (locked)</label>
            <div className="relative opacity-70">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 text-gray-400 -translate-y-1/2"
              />
              <input
                type="text"
                value={form.email ?? ""}
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
          onClick={() => saveProfile(form)}
          className="bg-main text-white px-6 py-3 rounded-lg font-medium hover:bg-mainHover transition"
        >
          {updatingProfile ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* PASSWORD CHANGE */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border space-y-8">
        <h2 className="text-xl font-semibold">Change Password</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <input
            type="password"
            placeholder="Current Password"
            value={passwordForm.currentPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                currentPassword: e.target.value,
              })
            }
            className="border p-3 rounded-lg"
          />

          <input
            type="password"
            placeholder="New Password"
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                newPassword: e.target.value,
              })
            }
            className="border p-3 rounded-lg"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={passwordForm.confirmPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                confirmPassword: e.target.value,
              })
            }
            className="border p-3 rounded-lg"
          />
        </div>

        <button
          onClick={() => updatePasswordHandler(passwordForm)}
          className="bg-main text-white px-6 py-3 rounded-lg font-medium hover:bg-mainHover transition"
        >
          {passwordUpdating ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
}
