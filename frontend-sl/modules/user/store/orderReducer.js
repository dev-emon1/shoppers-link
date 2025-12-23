// modules/user/store/orderReducer.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as orderService from "@/modules/user/services/orderService";
import { submitReviewApi } from "@/modules/user/services/reviewService";

/* helpers */
const nowTS = () => Math.floor(Date.now() / 1000);

export const loadOrders = createAsyncThunk(
  "userOrders/loadOrders",
  async (params = { page: 1, per_page: 10 }, { rejectWithValue }) => {
    try {
      const result = await orderService.fetchOrdersApi(params);

      let list = [];
      let meta = null;

      if (!result) {
        list = [];
        meta = null;
      } else if (Array.isArray(result)) {
        list = result;
      } else if (result.data && Array.isArray(result.data)) {
        list = result.data;
        meta = result.meta ?? null;
      } else if (result.data && Array.isArray(result.data.data)) {
        // double wrapped case (defensive)
        list = result.data.data;
        meta = result.data.meta ?? null;
      } else if (result.data && Array.isArray(result.data)) {
        list = result.data;
        meta = result.meta ?? null;
      } else if (result.data === undefined && Array.isArray(result)) {
        list = result;
      } else {
        // look for any array value inside result
        const arr = Object.values(result).find((v) => Array.isArray(v));
        if (arr) list = arr;
        else list = [];
        meta = result.meta ?? null;
      }

      return { list, meta, params };
    } catch (err) {
      // ensure we return a serializable rejection value
      return rejectWithValue(
        err?.response?.data ?? err?.message ?? String(err)
      );
    }
  }
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
  }
);

export const submitItemReview = createAsyncThunk(
  "userOrders/submitItemReview",
  async (
    { orderUnid, vendorOrderId, itemId, payload },
    { rejectWithValue }
  ) => {
    try {
      const res = await submitReviewApi(itemId, payload);
      return { orderUnid, vendorOrderId, itemId, review: res.review };
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

/* initial state */
const initialState = {
  list: {
    data: [],
    meta: null,
    loading: false,
    error: null,
    lastFetchedAt: null,
    params: { page: 1, per_page: 10 },
  },
  detailsByUnid: {},
  actions: {
    cancelling: {},
  },
};

const slice = createSlice({
  name: "userOrders",
  initialState,
  reducers: {
    // seed details map from list (useful after initial load)
    seedDetailsFromList(state) {
      if (!Array.isArray(state.list.data)) return;
      state.list.data.forEach((o) => {
        const key = o.unid ?? o.id;
        if (!key) return;
        state.detailsByUnid[key] = { data: o, lastSyncedAt: nowTS() };
      });
    },

    updateOrderLocally(state, action) {
      const { orderUnidOrId, patch } = action.payload;
      const idx = state.list.data.findIndex(
        (x) => x.unid === orderUnidOrId || x.id === orderUnidOrId
      );
      if (idx !== -1)
        state.list.data[idx] = { ...state.list.data[idx], ...patch };

      const key = orderUnidOrId;
      if (!state.detailsByUnid[key]) {
        const found = state.list.data.find(
          (x) => x.unid === orderUnidOrId || x.id === orderUnidOrId
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadOrders.pending, (s, _) => {
        s.list.loading = true;
        s.list.error = null;
      })
      .addCase(loadOrders.fulfilled, (s, action) => {
        s.list.loading = false;
        const { list, meta, params } = action.payload;
        const page = params?.page ?? 1;

        if (page > 1) {
          const existingUnids = new Set(
            (s.list.data || []).map((x) => x.unid ?? x.id)
          );
          const newItems = (list || []).filter(
            (it) => !existingUnids.has(it.unid ?? it.id)
          );
          s.list.data = [...(s.list.data || []), ...newItems];
        } else {
          s.list.data = list || [];
        }

        s.list.meta = meta ?? s.list.meta;
        s.list.lastFetchedAt = nowTS();
        s.list.params = params ?? s.list.params;

        // seed details map for immediate detail rendering
        (s.list.data || []).forEach((o) => {
          const key = o.unid ?? o.id;
          if (key) s.detailsByUnid[key] = { data: o, lastSyncedAt: nowTS() };
        });
      })
      .addCase(loadOrders.rejected, (s, action) => {
        s.list.loading = false;
        s.list.error = action.payload ?? action.error?.message ?? action.error;
      });

    builder
      .addCase(cancelOrder.pending, (s, action) => {
        const orderId = action.meta.arg.orderId;
        s.actions.cancelling[orderId] = true;
        const prev = s.detailsByUnid[orderId]?.data?.status ?? null;
        if (!s.detailsByUnid[orderId])
          s.detailsByUnid[orderId] = { data: null, lastSyncedAt: null };
        s.detailsByUnid[orderId].prevStatus = prev;
        if (s.detailsByUnid[orderId]?.data)
          s.detailsByUnid[orderId].data.status = "cancelled";
        const idx = s.list.data.findIndex(
          (x) => x.unid === orderId || x.id === orderId
        );
        if (idx !== -1) s.list.data[idx].status = "cancelled";
      })
      .addCase(cancelOrder.fulfilled, (s, action) => {
        const orderId = action.payload.orderId;
        s.actions.cancelling[orderId] = false;
        if (s.detailsByUnid[orderId])
          s.detailsByUnid[orderId].lastSyncedAt = nowTS();
      })
      .addCase(cancelOrder.rejected, (s, action) => {
        const orderId = action.meta.arg.orderId;
        s.actions.cancelling[orderId] = false;
        const prev = s.detailsByUnid[orderId]?.prevStatus ?? null;
        if (prev && s.detailsByUnid[orderId]?.data)
          s.detailsByUnid[orderId].data.status = prev;
        const idx = s.list.data.findIndex(
          (x) => x.unid === orderId || x.id === orderId
        );
        if (idx !== -1 && prev) s.list.data[idx].status = prev;
        s.detailsByUnid[orderId] = s.detailsByUnid[orderId] ?? {};
        s.detailsByUnid[orderId].error = action.payload ?? action.error;
      }) /* REVIEW SUBMIT */
      .addCase(submitItemReview.pending, (state, action) => {
        const { orderUnid, vendorOrderId, itemId } = action.meta.arg;
        const order = state.detailsByUnid[orderUnid]?.data;
        if (!order) return;

        order.vendor_orders.forEach((vo) => {
          if (vo.id !== vendorOrderId) return;
          vo.items.forEach((it) => {
            if (it.id === itemId) {
              it.review = { submitting: true };
            }
          });
        });
      })

      .addCase(submitItemReview.fulfilled, (state, action) => {
        const { orderUnid, vendorOrderId, itemId, review } = action.payload;
        const order = state.detailsByUnid[orderUnid]?.data;
        if (!order) return;

        order.vendor_orders.forEach((vo) => {
          if (vo.id !== vendorOrderId) return;
          vo.items.forEach((it) => {
            if (it.id === itemId) {
              it.review = {
                ...review,
                submitted: true,
              };
            }
          });
        });
      })

      .addCase(submitItemReview.rejected, (state, action) => {
        const { orderUnid, vendorOrderId, itemId } = action.meta.arg;
        const order = state.detailsByUnid[orderUnid]?.data;
        if (!order) return;

        order.vendor_orders.forEach((vo) => {
          if (vo.id !== vendorOrderId) return;
          vo.items.forEach((it) => {
            if (it.id === itemId) {
              it.review = {
                error: action.payload || "Failed",
              };
            }
          });
        });
      });
  },
});

export const { seedDetailsFromList, updateOrderLocally, clearOrdersState } =
  slice.actions;
export default slice.reducer;

/* selectors - use these from components/hooks */
export const selectOrdersListState = (state) => state.userOrders.list; // returns entire list object
export const selectOrdersData = (state) => state.userOrders.list.data ?? [];
export const selectOrdersLoading = (state) => !!state.userOrders.list.loading;
export const selectOrdersMeta = (state) => state.userOrders.list.meta;
export const selectOrderDetailsByUnid = (state, unid) =>
  state.userOrders.detailsByUnid?.[unid] ?? null;
export const selectIsCancelling = (state, orderId) =>
  !!state.userOrders.actions.cancelling[orderId];
