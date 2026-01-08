// hooks/useShopByBrands.js
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchShopByBrands } from "../store/homeReducer";

const useShopByBrands = () => {
  const dispatch = useDispatch();
  const shopByBrands = useSelector((state) => state.home.shopByBrands);

  useEffect(() => {
    const now = Date.now();

    const isExpired =
      !shopByBrands.lastFetched ||
      now - shopByBrands.lastFetched > shopByBrands.ttl;

    if (shopByBrands.status === "idle" || isExpired) {
      dispatch(fetchShopByBrands());
    }
  }, [
    dispatch,
    shopByBrands.status,
    shopByBrands.lastFetched,
    shopByBrands.ttl,
  ]);

  return shopByBrands;
};

export default useShopByBrands;
