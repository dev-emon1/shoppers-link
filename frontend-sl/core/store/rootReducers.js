// core/store/rootReducers.js
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/modules/user/store/authReducer";
import registerReducer from "@/modules/user/store/registerReducer";
import addressReducer from "@/modules/user/store/addressReducer";
import cartReducer from "@/modules/cart/store/cartReducer";
import wishlistReducer from "@/modules/wishlist/store/wishlistReducer";
import categoryReducer from "@/modules/category/store/categoryReducer";
import productReducer from "@/modules/product/store/productReducer";
import reviewReducer from "@/modules/product/store/reviewReducer";
import orderReducer from "@/modules/user/store/orderReducer";
import searchReducer from "@/modules/search/store/searchReducer";
import homeReducer from "@/modules/home/store/homeReducer";
import checkoutBillingReducer from "@/modules/checkout/store/billingReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  register: registerReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  category: categoryReducer,
  products: productReducer,
  productReview: reviewReducer,
  userOrders: orderReducer,
  search: searchReducer,
  home: homeReducer,
  checkoutBilling: checkoutBillingReducer,
  address: addressReducer,
});

export default rootReducer;
