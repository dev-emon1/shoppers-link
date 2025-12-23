// modules/wishlist/store/wishlistReducer.js
"use client";

import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "wishlist_state";

function loadWishlist() {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveWishlist(list) {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      // ignore
    }
  }
}

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlist: loadWishlist(),
  },
  reducers: {
    addToWishlist: (state, action) => {
      const item = action.payload;
      if (!item || !item.id) return;
      const exists = state.wishlist.find((p) => p.id === item.id);
      if (!exists) {
        state.wishlist.push(item);
      }
      saveWishlist(state.wishlist);
    },
    toggleWishlist: (state, action) => {
      const product = action.payload;
      if (!product || !product.id) return;
      const exists = state.wishlist.find((p) => p.id === product.id);
      if (exists) {
        state.wishlist = state.wishlist.filter((p) => p.id !== product.id);
      } else {
        state.wishlist.push(product);
      }
      saveWishlist(state.wishlist);
    },
    removeFromWishlist: (state, action) => {
      const id = action.payload;
      state.wishlist = state.wishlist.filter((p) => p.id !== id);
      saveWishlist(state.wishlist);
    },
    clearWishlist: (state) => {
      state.wishlist = [];
      saveWishlist(state.wishlist);
    },
    // optional: replace entire wishlist (useful for hydration)
    setWishlist: (state, action) => {
      state.wishlist = Array.isArray(action.payload) ? action.payload : [];
      saveWishlist(state.wishlist);
    },
  },
});

export const {
  addToWishlist,
  toggleWishlist,
  removeFromWishlist,
  clearWishlist,
  setWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
