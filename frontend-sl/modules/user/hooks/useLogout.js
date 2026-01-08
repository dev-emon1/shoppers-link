"use client";

import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import { logout } from "@/modules/user/store/authReducer";
import { resetBilling } from "@/modules/checkout/store/billingReducer";
import { clearCart } from "@/modules/cart/store/cartReducer";
import { clearWishlist } from "@/modules/wishlist/store/wishlistReducer";
import { clearAddresses } from "../store/addressReducer";

export default function useLogout() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout()); // auth
    dispatch(resetBilling()); // checkout
    dispatch(clearCart()); // cart
    dispatch(clearWishlist()); // wishlist
    dispatch(clearAddresses());

    if (typeof window !== "undefined") {
      localStorage.removeItem("auth");
    }

    router.push("/login");
  };

  return { logout: handleLogout };
}
