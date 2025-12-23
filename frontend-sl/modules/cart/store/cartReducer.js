"use client";

import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "cart_state";

function loadCart() {
  if (typeof window === "undefined") return {};
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveCart(cart) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }
}

const initialState = {
  cart: loadCart(), // { [vendorId]: { vendorName, items: [] } }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const { vendorId, vendorName } = item;

      if (!vendorId) return;

      if (!state.cart[vendorId]) {
        state.cart[vendorId] = {
          vendorName: vendorName || "Vendor",
          items: [],
        };
      }

      const vendorCart = state.cart[vendorId].items;

      const existing = vendorCart.find(
        (i) => i.id === item.id && i.variantId === item.variantId
      );

      if (existing) {
        existing.quantity += item.quantity || 1;
      } else {
        vendorCart.push({
          ...item,
          quantity: item.quantity || 1,
        });
      }

      saveCart(state.cart);
    },

    removeFromCart: (state, action) => {
      const { vendorId, productId, variantId } = action.payload;

      if (!state.cart[vendorId]) return;

      state.cart[vendorId].items = state.cart[vendorId].items.filter((i) => {
        const sameProduct = i.id === productId;
        const sameVariant = (i.variantId || null) === (variantId || null); // handle undefined
        return !(sameProduct && sameVariant);
      });

      if (state.cart[vendorId].items.length === 0) {
        delete state.cart[vendorId];
      }

      saveCart(state.cart);
    },

    updateQuantity: (state, action) => {
      const { vendorId, productId, variantId, quantity } = action.payload;

      if (!state.cart[vendorId]) return;

      const item = state.cart[vendorId].items.find((i) => {
        const sameProduct = i.id === productId;
        const sameVariant = (i.variantId || null) === (variantId || null); // handle undefined
        return sameProduct && sameVariant;
      });

      if (item) {
        const nextQty = Math.max(1, quantity);
        item.quantity = nextQty;
      }

      saveCart(state.cart);
    },

    clearCart: (state) => {
      state.cart = {};
      saveCart(state.cart);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
