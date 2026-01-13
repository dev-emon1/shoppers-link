"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAddresses } from "@/modules/user/store/addressReducer";

export default function useCachedAddresses(customerId) {
  const dispatch = useDispatch();

  const { list, cachedCustomerId, loading } = useSelector(
    (state) => state.address
  );

  useEffect(() => {
    if (!customerId) return;

    // 🔥 cache miss OR different user
    if (!list.length || cachedCustomerId !== customerId) {
      dispatch(fetchAddresses(customerId));
    }
  }, [customerId]);

  return {
    addresses: list,
    loading,
    hasAddresses: list.length > 0,
    defaultAddress: list.find((a) => a.is_default === 1),
  };
}
