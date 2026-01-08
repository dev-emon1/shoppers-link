"use client";

import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducers";
import { checkoutValidationMiddleware } from "@/modules/checkout/utils/checkoutValidationMiddleware";

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      checkoutValidationMiddleware
    ),
});
