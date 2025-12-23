"use client";

import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../store/cartReducer";
import { toNumber } from "../utils/utils";

/**
 * Hook: useCart
 * - Returns cart state and actions wired to redux reducers.
 *
 * Note: this file expects:
 *  - cart state stored at state.cart.cart (per your reducer initialState)
 *  - action creators addToCart/removeFromCart/updateQuantity/clearCart in ../store/cartReducer
 *  - utils.toNumber function available at ../utils/utils
 */

export default function useCart() {
  const dispatch = useDispatch();
  // defensive selector
  const cart =
    useSelector((state) => (state && state.cart ? state.cart.cart : {})) || {};

  // flatten items across vendor groups
  const flatItems = Object.values(cart || {}).flatMap((v) => v.items || []);

  const totalItems = flatItems.reduce(
    (acc, it) => acc + (Number(it.quantity) || 0),
    0
  );
  const totalPrice = flatItems.reduce(
    (acc, it) => acc + toNumber(it.price) * (Number(it.quantity) || 0),
    0
  );

  return {
    cart,
    totalItems,
    totalPrice,
    add: (payload) => dispatch(addToCart(payload)),
    remove: (payload) => dispatch(removeFromCart(payload)),
    updateQty: (payload) => dispatch(updateQuantity(payload)),
    clear: () => dispatch(clearCart()),
  };
}
