import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';
import { getFeedsApi, getOrderByNumberApi } from '@api';

export interface FeedState extends TOrdersData {
  feedIsLoading: boolean;
  currentOrderModal: TOrder | null;
  orderModalIsLoading: boolean;
}

export const initialState: FeedState = {
  total: 0,
  totalToday: 0,
  orders: [],
  feedIsLoading: false,
  currentOrderModal: null,
  orderModalIsLoading: false
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  selectors: {
    getFeedOrders: (state) => state.orders,
    getFeedTotalToday: (state) => state.totalToday,
    getFeedTotal: (state) => state.total,
    getFeedIsLoading: (state) => state.feedIsLoading,
    getCurrentOrderModal: (state) => state.currentOrderModal
  },
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(getFeedAsync.pending, (state) => {
        state.feedIsLoading = true;
      })
      .addCase(getFeedAsync.rejected, (state) => {
        state.feedIsLoading = false;
      })
      .addCase(getFeedAsync.fulfilled, (state, { payload }) => {
        state.feedIsLoading = false;
        if (payload.success) {
          state.total = payload.total;
          state.totalToday = payload.totalToday;
          state.orders = payload.orders;
        }
      })
      .addCase(getOrderByIdAsync.pending, (state) => {
        state.orderModalIsLoading = true;
      })
      .addCase(getOrderByIdAsync.rejected, (state) => {
        state.orderModalIsLoading = false;
      })
      .addCase(getOrderByIdAsync.fulfilled, (state, { payload }) => {
        state.orderModalIsLoading = false;
        state.currentOrderModal = payload.orders[0];
      })
});

export const getFeedAsync = createAsyncThunk('feed/orders', getFeedsApi);

export const getOrderByIdAsync = createAsyncThunk(
  'orderById',
  async (number: number) => await getOrderByNumberApi(number)
);

export const feedSliceReducer = feedSlice.reducer;

export const {
  getFeedOrders,
  getFeedTotal,
  getFeedTotalToday,
  getFeedIsLoading,
  getCurrentOrderModal
} = feedSlice.selectors;
