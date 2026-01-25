import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchFeaturedProductsApi,
  fetchNewArrivalsApi,
  fetchTopSellingApi,
  fetchTopRatingApi,
  fetchBannersApi,
  fetchShopByBrandsApi,
} from "../services/homeService";
import { normalizeFeaturedProducts } from "../utils/normalizeFeaturedProducts";
import { readBannerCache, writeBannerCache } from "../utils/bannerCache";
import { readProductCache, writeProductCache } from "../utils/productCache";

/* ------------------------------------------------------------
   TTL (Time To Live)
------------------------------------------------------------ */
const BANNERS_TTL = 60 * 60 * 1000; // 1 hour
const FEATURED_TTL = 10 * 60 * 1000;
const TOP_RATING_TTL = 10 * 60 * 1000;
const TOP_SELLING_TTL = 5 * 60 * 1000;
const NEW_ARRIVALS_TTL = 3 * 60 * 1000;
const SHOP_BY_BRAND_TTL = 60 * 60 * 1000;

/* ------------------------------------------------------------
   THUNKS
------------------------------------------------------------ */

/* ---------- BANNERS ---------- */
export const fetchBanners = createAsyncThunk(
  "home/fetchBanners",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState().home.banners;

      // Redux TTL cache
      if (
        state.data.length > 0 &&
        state.lastFetched &&
        Date.now() - state.lastFetched < state.ttl
      ) {
        return state.data;
      }

      // Session cache
      const cached = readBannerCache();
      if (cached && Array.isArray(cached)) {
        return cached;
      }

      // Network
      const data = await fetchBannersApi();

      // Save session cache
      writeBannerCache(data);

      return data;
    } catch {
      return rejectWithValue("Failed to fetch banners");
    }
  },
);

/* ---------- FEATURED PRODUCTS ---------- */
export const fetchFeaturedProducts = createAsyncThunk(
  "home/fetchFeaturedProducts",
  async ({ page = 1 }, { getState, rejectWithValue }) => {
    try {
      const state = getState().home.featured;

      if (
        page === 1 &&
        state.data.length > 0 &&
        state.lastFetched &&
        Date.now() - state.lastFetched < state.ttl
      ) {
        return {
          products: state.data,
          meta: {
            current_page: 1,
            last_page: state.lastPage ?? 1,
          },
        };
      }

      if (page === 1) {
        const cached = readProductCache("featured");
        if (cached?.products?.length) return cached;
      }

      const res = await fetchFeaturedProductsApi(page);

      const payload = {
        products: normalizeFeaturedProducts(res.data),
        meta: res.meta,
      };

      if (page === 1) {
        writeProductCache("featured", payload);
      }

      return payload;
    } catch {
      return rejectWithValue("Failed to fetch featured products");
    }
  },
);

/* ---------- TOP RATING ---------- */
export const fetchTopRatingProducts = createAsyncThunk(
  "home/fetchTopRatingProducts",
  async ({ page = 1 }, { getState, rejectWithValue }) => {
    try {
      const state = getState().home.topRating;

      if (
        page === 1 &&
        state.data.length > 0 &&
        state.lastFetched &&
        Date.now() - state.lastFetched < state.ttl
      ) {
        return {
          data: state.data,
          meta: {
            current_page: 1,
            last_page: state.lastPage ?? 1,
          },
        };
      }

      if (page === 1) {
        const cached = readProductCache("topRating");
        if (cached?.data?.length) return cached;
      }

      const res = await fetchTopRatingApi(page);

      if (page === 1) {
        writeProductCache("topRating", res);
      }

      return res;
    } catch {
      return rejectWithValue("Failed to fetch top rating products");
    }
  },
);

/* ---------- NEW ARRIVALS ---------- */
export const fetchNewArrivals = createAsyncThunk(
  "home/fetchNewArrivals",
  async ({ page = 1 }, { getState, rejectWithValue }) => {
    try {
      const state = getState().home.newArrivals;

      if (
        page === 1 &&
        state.data.length > 0 &&
        state.lastFetched &&
        Date.now() - state.lastFetched < state.ttl
      ) {
        return {
          data: state.data,
          meta: {
            current_page: 1,
            last_page: state.lastPage ?? 1,
          },
        };
      }

      if (page === 1) {
        const cached = readProductCache("newArrivals");
        if (cached?.data?.length) return cached;
      }

      const res = await fetchNewArrivalsApi(page);

      if (page === 1) {
        writeProductCache("newArrivals", res);
      }

      return res;
    } catch {
      return rejectWithValue("Failed to fetch new arrivals");
    }
  },
);

/* ---------- TOP SELLING ---------- */
export const fetchTopSelling = createAsyncThunk(
  "home/fetchTopSelling",
  async ({ page = 1 }, { getState, rejectWithValue }) => {
    try {
      const state = getState().home.topSelling;

      if (
        page === 1 &&
        state.data.length > 0 &&
        state.lastFetched &&
        Date.now() - state.lastFetched < state.ttl
      ) {
        return {
          data: state.data,
          meta: {
            current_page: 1,
            last_page: state.lastPage ?? 1,
          },
        };
      }

      if (page === 1) {
        const cached = readProductCache("topSelling");
        if (cached?.data?.length) return cached;
      }

      const res = await fetchTopSellingApi(page);

      if (page === 1) {
        writeProductCache("topSelling", res);
      }

      return res;
    } catch {
      return rejectWithValue("Failed to fetch top selling products");
    }
  },
);

/* ---------- SHOP BY BRANDS ---------- */
export const fetchShopByBrands = createAsyncThunk(
  "home/fetchShopByBrands",
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      return await fetchShopByBrandsApi(page);
    } catch {
      return rejectWithValue("Failed to fetch shop by brands");
    }
  },
);

/* ------------------------------------------------------------
   SLICE
------------------------------------------------------------ */

const homeSlice = createSlice({
  name: "home",
  initialState: {
    banners: {
      data: [],
      status: "idle",
      lastFetched: null,
      ttl: BANNERS_TTL,
    },

    featured: {
      data: [],
      status: "idle",
      page: 1,
      lastPage: null,
      hasMore: true,
      lastFetched: null,
      ttl: FEATURED_TTL,
    },

    topRating: {
      data: [],
      status: "idle",
      page: 1,
      lastPage: null,
      hasMore: true,
      lastFetched: null,
      ttl: TOP_RATING_TTL,
    },

    newArrivals: {
      data: [],
      status: "idle",
      page: 1,
      lastPage: null,
      hasMore: true,
      lastFetched: null,
      ttl: NEW_ARRIVALS_TTL,
    },

    topSelling: {
      data: [],
      status: "idle",
      page: 1,
      lastPage: null,
      hasMore: true,
      lastFetched: null,
      ttl: TOP_SELLING_TTL,
    },

    shopByBrands: {
      data: [],
      status: "idle",
      page: 1,
      lastPage: null,
      hasMore: true,
      lastFetched: null,
      ttl: SHOP_BY_BRAND_TTL,
    },
  },

  reducers: {},

  extraReducers: (builder) => {
    /* ---------- BANNERS ---------- */
    builder
      .addCase(fetchBanners.pending, (state) => {
        if (state.banners.data.length === 0) {
          state.banners.status = "loading";
        }
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.banners.status = "success";
        state.banners.data = action.payload;
        state.banners.lastFetched = Date.now();
      })
      .addCase(fetchBanners.rejected, (state) => {
        state.banners.status = "error";
      });

    /* ---------- FEATURED ---------- */
    builder
      .addCase(fetchFeaturedProducts.pending, (state) => {
        if (state.featured.data.length === 0) {
          state.featured.status = "loading";
        }
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        const { products, meta } = action.payload;
        state.featured.status = "success";
        state.featured.data =
          meta.current_page === 1
            ? products
            : state.featured.data.concat(products);
        state.featured.page = meta.current_page;
        state.featured.lastPage = meta.last_page;
        state.featured.hasMore = meta.current_page < meta.last_page;
        state.featured.lastFetched = Date.now();
      })
      .addCase(fetchFeaturedProducts.rejected, (state) => {
        state.featured.status = "error";
      });

    /* ---------- TOP RATING ---------- */
    builder
      .addCase(fetchTopRatingProducts.pending, (state) => {
        if (state.topRating.data.length === 0) {
          state.topRating.status = "loading";
        }
      })
      .addCase(fetchTopRatingProducts.fulfilled, (state, action) => {
        const { data, meta } = action.payload;
        state.topRating.status = "success";
        state.topRating.data =
          meta.current_page === 1 ? data : state.topRating.data.concat(data);
        state.topRating.page = meta.current_page;
        state.topRating.lastPage = meta.last_page;
        state.topRating.hasMore = meta.current_page < meta.last_page;
        state.topRating.lastFetched = Date.now();
      })
      .addCase(fetchTopRatingProducts.rejected, (state) => {
        state.topRating.status = "error";
      });

    /* ---------- NEW ARRIVALS ---------- */
    builder
      .addCase(fetchNewArrivals.pending, (state) => {
        if (state.newArrivals.data.length === 0) {
          state.newArrivals.status = "loading";
        }
      })
      .addCase(fetchNewArrivals.fulfilled, (state, action) => {
        const { data, meta } = action.payload;
        state.newArrivals.status = "success";
        state.newArrivals.data =
          meta.current_page === 1 ? data : state.newArrivals.data.concat(data);
        state.newArrivals.page = meta.current_page;
        state.newArrivals.lastPage = meta.last_page;
        state.newArrivals.hasMore = meta.current_page < meta.last_page;
        state.newArrivals.lastFetched = Date.now();
      })
      .addCase(fetchNewArrivals.rejected, (state) => {
        state.newArrivals.status = "error";
      });

    /* ---------- TOP SELLING ---------- */
    builder
      .addCase(fetchTopSelling.pending, (state) => {
        if (state.topSelling.data.length === 0) {
          state.topSelling.status = "loading";
        }
      })
      .addCase(fetchTopSelling.fulfilled, (state, action) => {
        const { data, meta } = action.payload;
        state.topSelling.status = "success";
        state.topSelling.data =
          meta.current_page === 1 ? data : state.topSelling.data.concat(data);
        state.topSelling.page = meta.current_page;
        state.topSelling.lastPage = meta.last_page;
        state.topSelling.hasMore = meta.current_page < meta.last_page;
        state.topSelling.lastFetched = Date.now();
      })
      .addCase(fetchTopSelling.rejected, (state) => {
        state.topSelling.status = "error";
      });

    /* ---------- SHOP BY BRANDS ---------- */
    builder
      .addCase(fetchShopByBrands.pending, (state) => {
        if (state.shopByBrands.data.length === 0) {
          state.shopByBrands.status = "loading";
        }
      })
      .addCase(fetchShopByBrands.fulfilled, (state, action) => {
        const { data, meta } = action.payload;
        state.shopByBrands.status = "success";
        state.shopByBrands.data =
          meta.current_page === 1 ? data : state.shopByBrands.data.concat(data);
        state.shopByBrands.page = meta.current_page;
        state.shopByBrands.lastPage = meta.last_page;
        state.shopByBrands.hasMore = meta.current_page < meta.last_page;
        state.shopByBrands.lastFetched = Date.now();
      })
      .addCase(fetchShopByBrands.rejected, (state) => {
        state.shopByBrands.status = "error";
      });
  },
});

export default homeSlice.reducer;
