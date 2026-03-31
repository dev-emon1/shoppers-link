// modules/user/store/orderReducer.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as orderService from "@/modules/user/services/orderService";
import { submitReviewApi } from "@/modules/user/services/reviewService";

/* ----------------------------------
   HELPERS
---------------------------------- */
const nowTS = () => Math.floor(Date.now() / 1000);

/* 🔥 SAFE MERGE (NO DUPLICATE + SORT) */
const mergeOrders = (existing = [], incoming = []) => {
  const map = new Map();

  [...existing, ...incoming].forEach((o) => {
    const key = o.unid ?? o.id;
    if (!key) return;
    map.set(key, o);
  });

  return Array.from(map.values()).sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  );
};

/* ----------------------------------
   ASYNC ACTIONS
---------------------------------- */
export const loadOrders = createAsyncThunk(
  "userOrders/loadOrders",
  async (params = { page: 1, per_page: 10 }, { rejectWithValue }) => {
    try {
      const result = await orderService.fetchOrdersApi(params);

      let list = [];
      let meta = null;

      if (!result) {
        list = [];
      } else if (Array.isArray(result)) {
        list = result;
      } else if (result.data && Array.isArray(result.data)) {
        list = result.data;
        meta = result.meta ?? null;
      } else if (result.data && Array.isArray(result.data.data)) {
        list = result.data.data;
        meta = result.data.meta ?? null;
      } else {
        const arr = Object.values(result).find((v) => Array.isArray(v));
        list = arr || [];
        meta = result.meta ?? null;
      }

      return { list, meta, params };
    } catch (err) {
      return rejectWithValue(
        err?.response?.data ?? err?.message ?? String(err),
      );
    }
  },
);

export const cancelOrder = createAsyncThunk(
  "userOrders/cancelOrder",
  async ({ orderId, reason = null } = {}, { rejectWithValue }) => {
    try {
      const resp = await orderService.cancelOrderApi(orderId, { reason });
      return { orderId, resp };
    } catch (err) {
      return rejectWithValue(err?.response?.data ?? err.message ?? err);
    }
  },
);

export const submitItemReview = createAsyncThunk(
  "userOrders/submitItemReview",
  async (
    { orderUnid, vendorOrderId, itemId, payload },
    { rejectWithValue },
  ) => {
    try {
      const res = await submitReviewApi(itemId, payload);
      return { orderUnid, vendorOrderId, itemId, review: res.review };
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err.message);
    }
  },
);

/* ----------------------------------
   INITIAL STATE
---------------------------------- */
const initialState = {
  list: {
    data: [],
    meta: null,
    loading: false,
    error: null,
    lastFetchedAt: null,
    hasFetched: false,
    params: { page: 1, per_page: 10 },
  },
  detailsByUnid: {},
  actions: {
    cancelling: {},
  },
};

/* ----------------------------------
   SLICE
---------------------------------- */
const slice = createSlice({
  name: "userOrders",
  initialState,

  reducers: {
    seedDetailsFromList(state) {
      if (!Array.isArray(state.list.data)) return;

      state.list.data.forEach((o) => {
        const key = o.unid ?? o.id;
        if (!key) return;

        state.detailsByUnid[key] = {
          data: o,
          lastSyncedAt: nowTS(),
        };
      });
    },

    updateOrderLocally(state, action) {
      const { orderUnidOrId, patch } = action.payload;

      const idx = state.list.data.findIndex(
        (x) => x.unid === orderUnidOrId || x.id === orderUnidOrId,
      );

      if (idx !== -1) {
        state.list.data[idx] = {
          ...state.list.data[idx],
          ...patch,
        };
      }

      const key = orderUnidOrId;

      if (!state.detailsByUnid[key]) {
        const found = state.list.data.find(
          (x) => x.unid === orderUnidOrId || x.id === orderUnidOrId,
        );

        if (found) {
          state.detailsByUnid[key] = {
            data: { ...found, ...patch },
            lastSyncedAt: nowTS(),
          };
        }
      } else {
        state.detailsByUnid[key].data = {
          ...state.detailsByUnid[key].data,
          ...patch,
        };
        state.detailsByUnid[key].lastSyncedAt = nowTS();
      }
    },

    clearOrdersState(state) {
      state.list = initialState.list;
      state.detailsByUnid = {};
      state.actions = initialState.actions;
    },

    addNewOrder(state, action) {
      const order = action.payload;

      const exists = state.list.data.some(
        (o) => o.unid === order.unid || o.id === order.id,
      );

      if (!exists) {
        state.list.data.unshift(order);
      }

      // 🔥 allow immediate refetch
      state.list.lastFetchedAt = 0;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loadOrders.pending, (s, action) => {
        if (!action.meta.arg?.silent) {
          s.list.loading = true;
        }
        s.list.error = null;
      })

      .addCase(loadOrders.fulfilled, (s, action) => {
        s.list.loading = false;

        const { list, meta, params } = action.payload;
        const page = params?.page ?? 1;

        if (page > 1) {
          const existingIds = new Set(
            (s.list.data || []).map((x) => x.unid ?? x.id),
          );

          const newItems = (list || []).filter(
            (it) => !existingIds.has(it.unid ?? it.id),
          );

          s.list.data = [...s.list.data, ...newItems];
        } else {
          // 🔥 ENTERPRISE FIX: KEEP OPTIMISTIC DATA
          const incomingIds = new Set((list || []).map((o) => o.unid));

          const optimistic = (s.list.data || []).filter(
            (o) => !incomingIds.has(o.unid),
          );

          s.list.data = [...optimistic, ...(list || [])];
        }

        s.list.meta = meta ?? s.list.meta;
        s.list.lastFetchedAt = Math.floor(Date.now() / 1000);
        s.list.hasFetched = true;
        s.list.params = params ?? s.list.params;

        // sync details
        (s.list.data || []).forEach((o) => {
          const key = o.unid ?? o.id;
          if (key) {
            s.detailsByUnid[key] = {
              data: o,
              lastSyncedAt: Math.floor(Date.now() / 1000),
            };
          }
        });
      })

      .addCase(loadOrders.rejected, (s, action) => {
        s.list.loading = false;
        s.list.hasFetched = true;
        s.list.error = action.payload ?? action.error?.message ?? action.error;
      });

    builder
      .addCase(cancelOrder.pending, (s, action) => {
        const orderId = action.meta.arg.orderId;

        s.actions.cancelling[orderId] = true;

        const prev = s.detailsByUnid[orderId]?.data?.status ?? null;

        if (!s.detailsByUnid[orderId]) {
          s.detailsByUnid[orderId] = { data: null };
        }

        s.detailsByUnid[orderId].prevStatus = prev;

        if (s.detailsByUnid[orderId]?.data) {
          s.detailsByUnid[orderId].data.status = "cancelled";
        }

        const idx = s.list.data.findIndex(
          (x) => x.unid === orderId || x.id === orderId,
        );

        if (idx !== -1) {
          s.list.data[idx].status = "cancelled";
        }
      })

      .addCase(cancelOrder.fulfilled, (s, action) => {
        const orderId = action.payload.orderId;
        s.actions.cancelling[orderId] = false;

        if (s.detailsByUnid[orderId]) {
          s.detailsByUnid[orderId].lastSyncedAt = nowTS();
        }
      })

      .addCase(cancelOrder.rejected, (s, action) => {
        const orderId = action.meta.arg.orderId;

        s.actions.cancelling[orderId] = false;

        const prev = s.detailsByUnid[orderId]?.prevStatus ?? null;

        if (prev && s.detailsByUnid[orderId]?.data) {
          s.detailsByUnid[orderId].data.status = prev;
        }

        const idx = s.list.data.findIndex(
          (x) => x.unid === orderId || x.id === orderId,
        );

        if (idx !== -1 && prev) {
          s.list.data[idx].status = prev;
        }
      });
  },
});

/* ----------------------------------
   EXPORTS
---------------------------------- */
export const {
  seedDetailsFromList,
  updateOrderLocally,
  clearOrdersState,
  addNewOrder,
} = slice.actions;

export default slice.reducer;

/* SELECTORS */
export const selectOrdersData = (state) => state.userOrders.list.data ?? [];

export const selectOrdersLoading = (state) => !!state.userOrders.list.loading;

export const selectOrdersMeta = (state) => state.userOrders.list.meta;

export const selectOrderDetailsByUnid = (state, unid) =>
  state.userOrders.detailsByUnid?.[unid] ?? null;

export const selectIsCancelling = (state, orderId) =>
  !!state.userOrders.actions.cancelling[orderId];
