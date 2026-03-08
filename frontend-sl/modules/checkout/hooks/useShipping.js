"use client";

import { useDispatch, useSelector } from "react-redux";
import { fetchShippingCharge } from "../store/shippingReducer";

export default function useShipping() {
  const dispatch = useDispatch();

  const { shippingFee, grandTotal, loading } = useSelector(
    (state) =>
      state.checkoutShipping || {
        shippingFee: 0,
        grandTotal: 0,
        loading: false,
      }
  );

  const calculateShipping = (payload) => {
    if (!payload) return;

    dispatch(fetchShippingCharge(payload));
  };

  return {
    shippingFee,
    grandTotal,
    loading,
    calculateShipping,
  };
}