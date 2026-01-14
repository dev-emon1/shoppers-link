"use client";

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import toast from "react-hot-toast";
import { updateAvatar } from "@/modules/user/store/profileReducer";
import { setUserFromToken } from "@/modules/user/store/authReducer";

export function useAvatarUpload() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [preview, setPreview] = useState(null);

  const uploadAvatar = async (file) => {
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    const result = await dispatch(updateAvatar(file));

    if (updateAvatar.fulfilled.match(result)) {
      toast.success("Profile picture updated");

      dispatch(
        setUserFromToken({
          ...user,
          customer: {
            ...user.customer,
            profile_picture: result.payload.profile_picture,
          },
        })
      );

      return true;
    }

    toast.error("Image upload failed");
    return false;
  };

  return {
    preview,
    uploadAvatar,
  };
}
