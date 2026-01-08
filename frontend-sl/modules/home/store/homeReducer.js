import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { normalizeFeaturedProducts } from "../utils/normalizeFeaturedProducts";
import {
  fetchFeaturedProductsApi,
  fetchNewArrivalsApi,
  fetchTopSellingApi,
  fetchTopRatingApi,
  fetchBannersApi,
  fetchShopByBrandsApi,
} from "../services/homeService";

/**
 * TTL = Time To Live in milliseconds
 */
const BANNERS_TTL = 60 * 60 * 1000; // 1 hour
const FEATURED_TTL = 10 * 60 * 1000;
const TOP_RATING_TTL = 10 * 60 * 1000;
const TOP_SELLING_TTL = 5 * 60 * 1000;
const NEW_ARRIVALS_TTL = 3 * 60 * 1000;
const SHOP_BY_BRAND_TTL = 60 * 60 * 1000; // 1 hour

export const fetchBanners = createAsyncThunk(
  "home/fetchBanners",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchBannersApi();
    } catch {
      return rejectWithValue("Failed to fetch banners");
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  "home/fetchFeaturedProducts",
  async (_, { rejectWithValue }) => {
    try {
      const raw = await fetchFeaturedProductsApi();
      return normalizeFeaturedProducts(raw);
    } catch {
      return rejectWithValue("Failed to fetch featured products");
    }
  }
);

export const fetchTopRatingProducts = createAsyncThunk(
  "home/fetchTopRatingProducts",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchTopRatingApi();
    } catch {
      return rejectWithValue("Failed to fetch top rating products");
    }
  }
);

export const fetchNewArrivals = createAsyncThunk(
  "home/fetchNewArrivals",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchNewArrivalsApi();
    } catch (err) {
      return rejectWithValue("Failed to fetch new arrivals");
    }
  }
);

export const fetchTopSelling = createAsyncThunk(
  "home/fetchTopSelling",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchTopSellingApi();
    } catch {
      return rejectWithValue("Failed to fetch top selling products");
    }
  }
);

export const fetchShopByBrands = createAsyncThunk(
  "home/fetchShopByBrands",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchShopByBrandsApi();
    } catch {
      return rejectWithValue("Failed to fetch shop by brands");
    }
  }
);

const homeSlice = createSlice({
  name: "home",
  initialState: {
    banners: {
      data: [],
      status: "idle", // idle | loading | success | error
      lastFetched: null,
      ttl: BANNERS_TTL,
    },
    featured: {
      data: [],
      status: "idle", // idle | loading | success | error
      lastFetched: null,
      ttl: FEATURED_TTL,
    },
    topRating: {
      data: [],
      status: "idle",
      lastFetched: null,
      ttl: TOP_RATING_TTL,
    },
    newArrivals: {
      data: [],
      status: "idle",
      lastFetched: null,
      ttl: NEW_ARRIVALS_TTL,
    },
    topSelling: {
      data: [],
      status: "idle",
      lastFetched: null,
      ttl: TOP_SELLING_TTL,
    },
    shopByBrands: {
      data: [],
      status: "idle",
      lastFetched: null,
      ttl: SHOP_BY_BRAND_TTL,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.banners.status = "loading";
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.banners.status = "success";
        state.banners.data = action.payload;
        state.banners.lastFetched = Date.now();
      })
      .addCase(fetchBanners.rejected, (state) => {
        state.banners.status = "error";
      })
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.featured.status = "loading";
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featured.status = "success";
        state.featured.data = action.payload;
        state.featured.lastFetched = Date.now();
      })
      .addCase(fetchFeaturedProducts.rejected, (state) => {
        state.featured.status = "error";
      })
      .addCase(fetchTopRatingProducts.pending, (state) => {
        state.topRating.status = "loading";
      })
      .addCase(fetchTopRatingProducts.fulfilled, (state, action) => {
        state.topRating.status = "success";
        state.topRating.data = action.payload;
        state.topRating.lastFetched = Date.now();
      })
      .addCase(fetchTopRatingProducts.rejected, (state) => {
        state.topRating.status = "error";
      })
      .addCase(fetchNewArrivals.pending, (state) => {
        state.newArrivals.status = "loading";
      })
      .addCase(fetchNewArrivals.fulfilled, (state, action) => {
        state.newArrivals.status = "success";
        state.newArrivals.data = action.payload;
        state.newArrivals.lastFetched = Date.now();
      })
      .addCase(fetchNewArrivals.rejected, (state) => {
        state.newArrivals.status = "error";
      })
      .addCase(fetchTopSelling.pending, (state) => {
        state.topSelling.status = "loading";
      })
      .addCase(fetchTopSelling.fulfilled, (state, action) => {
        state.topSelling.status = "success";
        state.topSelling.data = action.payload;
        state.topSelling.lastFetched = Date.now();
      })
      .addCase(fetchTopSelling.rejected, (state) => {
        state.topSelling.status = "error";
      })
      .addCase(fetchShopByBrands.pending, (state) => {
        state.shopByBrands.status = "loading";
      })
      .addCase(fetchShopByBrands.fulfilled, (state, action) => {
        state.shopByBrands.status = "success";
        state.shopByBrands.data = action.payload;
        state.shopByBrands.lastFetched = Date.now();
      })
      .addCase(fetchShopByBrands.rejected, (state) => {
        state.shopByBrands.status = "error";
      });
  },
});

export default homeSlice.reducer;
