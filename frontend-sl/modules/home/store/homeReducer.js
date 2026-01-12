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
import { readBannerCache, writeBannerCache } from "../utils/bannerCache";

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
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState().home.banners;

      // 1️⃣ Redux TTL cache
      if (
        state.data.length > 0 &&
        state.lastFetched &&
        Date.now() - state.lastFetched < state.ttl
      ) {
        return state.data;
      }

      // 2️⃣ Session cache
      const cached = readBannerCache();
      if (cached && Array.isArray(cached)) {
        return cached;
      }

      // 3️⃣ Network
      const data = await fetchBannersApi();

      // 4️⃣ Save to session cache
      writeBannerCache(data);

      return data;
    } catch {
      return rejectWithValue("Failed to fetch banners");
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  "home/fetchFeaturedProducts",
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      const res = await fetchFeaturedProductsApi(page);

      return {
        products: normalizeFeaturedProducts(res.data),
        meta: res.meta,
      };
    } catch {
      return rejectWithValue("Failed to fetch featured products");
    }
  }
);

export const fetchTopRatingProducts = createAsyncThunk(
  "home/fetchTopRatingProducts",
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      return await fetchTopRatingApi(page);
    } catch {
      return rejectWithValue("Failed to fetch top rating products");
    }
  }
);

export const fetchNewArrivals = createAsyncThunk(
  "home/fetchNewArrivals",
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      return await fetchNewArrivalsApi(page);
    } catch {
      return rejectWithValue("Failed to fetch new arrivals");
    }
  }
);

export const fetchTopSelling = createAsyncThunk(
  "home/fetchTopSelling",
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      return await fetchTopSellingApi(page);
    } catch {
      return rejectWithValue("Failed to fetch top selling products");
    }
  }
);

export const fetchShopByBrands = createAsyncThunk(
  "home/fetchShopByBrands",
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      return await fetchShopByBrandsApi(page);
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
      })

      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.featured.status = "loading";
      })

      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        const { products, meta } = action.payload;
        state.featured.status = "success";
        if (meta.current_page === 1) {
          state.featured.data = products;
        } else {
          state.featured.data.push(...products);
        }
        state.featured.page = meta.current_page;
        state.featured.lastPage = meta.last_page;
        state.featured.hasMore = meta.current_page < meta.last_page;
        state.featured.lastFetched = Date.now();
      })
      .addCase(fetchFeaturedProducts.rejected, (state) => {
        state.featured.status = "error";
      })

      .addCase(fetchTopRatingProducts.pending, (state) => {
        state.topRating.status = "loading";
      })
      .addCase(fetchTopRatingProducts.fulfilled, (state, action) => {
        const { data, meta } = action.payload;
        state.topRating.status = "success";
        if (meta.current_page === 1) {
          state.topRating.data = data;
        } else {
          state.topRating.data.push(...data);
        }
        state.topRating.page = meta.current_page;
        state.topRating.lastPage = meta.last_page;
        state.topRating.hasMore = meta.current_page < meta.last_page;
        state.topRating.lastFetched = Date.now();
      })
      .addCase(fetchTopRatingProducts.rejected, (state) => {
        state.topRating.status = "error";
      })

      .addCase(fetchNewArrivals.pending, (state) => {
        state.newArrivals.status = "loading";
      })
      .addCase(fetchNewArrivals.fulfilled, (state, action) => {
        const { data, meta } = action.payload;
        state.newArrivals.status = "success";
        if (meta.current_page === 1) {
          state.newArrivals.data = data;
        } else {
          state.newArrivals.data.push(...data);
        }
        state.newArrivals.page = meta.current_page;
        state.newArrivals.lastPage = meta.last_page;
        state.newArrivals.hasMore = meta.current_page < meta.last_page;
        state.newArrivals.lastFetched = Date.now();
      })
      .addCase(fetchNewArrivals.rejected, (state) => {
        state.newArrivals.status = "error";
      })

      .addCase(fetchTopSelling.pending, (state) => {
        state.topSelling.status = "loading";
      })
      .addCase(fetchTopSelling.fulfilled, (state, action) => {
        const { data, meta } = action.payload;
        state.topSelling.status = "success";
        if (meta.current_page === 1) {
          state.topSelling.data = data;
        } else {
          state.topSelling.data.push(...data);
        }
        state.topSelling.page = meta.current_page;
        state.topSelling.lastPage = meta.last_page;
        state.topSelling.hasMore = meta.current_page < meta.last_page;
        state.topSelling.lastFetched = Date.now();
      })
      .addCase(fetchTopSelling.rejected, (state) => {
        state.topSelling.status = "error";
      })

      .addCase(fetchShopByBrands.pending, (state) => {
        state.shopByBrands.status = "loading";
      })
      .addCase(fetchShopByBrands.fulfilled, (state, action) => {
        const { data, meta } = action.payload;
        state.shopByBrands.status = "success";
        if (meta.current_page === 1) {
          state.shopByBrands.data = data;
        } else {
          state.shopByBrands.data.push(...data);
        }
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
