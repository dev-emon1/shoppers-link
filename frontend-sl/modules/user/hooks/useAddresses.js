import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAddresses,
  addAddress,
  updateAddress,
  clearAddressError,
  invalidateAddressCache,
} from "@/modules/user/store/addressReducer";

/**
 * smart address hook
 */
export const useAddresses = (customerId) => {
  const dispatch = useDispatch();

  const { list, loading, error, cachedCustomerId } = useSelector(
    (state) => state.address
  );

  /* ==============================
     Smart auto-fetch
  ================================ */
  useEffect(() => {
    if (!customerId) return;

    // Only fetch if:
    // - no cache yet
    // - customer changed
    if (cachedCustomerId !== customerId) {
      dispatch(fetchAddresses(customerId));
    }
  }, [customerId, cachedCustomerId, dispatch]);

  /* ==============================
     Public actions
  ================================ */

  const fetchIfNeeded = useCallback(() => {
    if (!customerId) return;
    dispatch(fetchAddresses(customerId));
  }, [customerId, dispatch]);

  const createAddress = useCallback(
    (payload) => dispatch(addAddress(payload)),
    [dispatch]
  );

  const editAddress = useCallback(
    (id, payload) => dispatch(updateAddress({ id, payload })),
    [dispatch]
  );

  const clearError = useCallback(
    () => dispatch(clearAddressError()),
    [dispatch]
  );

  const resetCache = useCallback(
    () => dispatch(invalidateAddressCache()),
    [dispatch]
  );

  return {
    addresses: list,
    loading,
    error,

    fetchIfNeeded,
    createAddress,
    editAddress,
    clearError,
    resetCache,
  };
};
