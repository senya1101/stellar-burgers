import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder, TUser } from '@utils-types';
import {
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TRegisterData,
  updateUserApi
} from '@api';
import { deleteCookie, setCookie } from '../../../utils/cookie';

export interface UserState {
  user: TUser | null;
  isLoading: boolean;
  orders: TOrder[];
  error: string;
  ordersIsLoading: boolean;
}

export const initialState: UserState = {
  user: null,
  isLoading: false,
  orders: [],
  error: '',
  ordersIsLoading: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUser: () => initialState,
    setErrorUser: (state, action) => {
      if (typeof action.payload === 'string') state.error = action.payload;
    }
  },
  selectors: {
    getUser: (state) => state.user,
    getUserIsLoading: (state) => state.isLoading,
    getUsersOrders: (state) => state.orders,
    getErrorUser: (state) => state.error,
    getOrdersIsLoading: (state) => state.ordersIsLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '';
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = '';
        if (payload && payload.success) {
          state.user = payload.user;
          setCookie('accessToken', payload.accessToken);
          localStorage.setItem('refreshToken', payload.refreshToken);
        }
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message!;
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = '';
        if (payload && payload.success) {
          setCookie('accessToken', payload.accessToken);
          localStorage.setItem('refreshToken', payload.refreshToken);
          state.user = payload.user;
        }
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = '';
        if (payload && payload.success) {
          state.user = payload.user;
        }
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(logoutUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        if (payload) {
          state.user = null;
          state.orders = [];
          deleteCookie('accessToken');
        }
      })
      .addCase(getUsersOrdersAsync.pending, (state) => {
        state.ordersIsLoading = true;
      })
      .addCase(getUsersOrdersAsync.rejected, (state) => {
        state.ordersIsLoading = false;
      })
      .addCase(getUsersOrdersAsync.fulfilled, (state, { payload }) => {
        state.orders = payload;
        state.ordersIsLoading = false;
      })
      .addCase(getUserAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserAsync.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getUserAsync.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.isLoading = false;
      });
  }
});

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }: { email: string; password: string }) =>
    await loginUserApi({ email, password })
);

export const registerUser = createAsyncThunk(
  'user/register',
  async ({ email, name, password }: TRegisterData) =>
    await registerUserApi({ email, name, password })
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (user: Partial<TRegisterData>) => await updateUserApi(user)
);

export const logoutUser = createAsyncThunk('user/logout', logoutApi);

export const getUsersOrdersAsync = createAsyncThunk(
  'user/orders',
  getOrdersApi
);

export const getUserAsync = createAsyncThunk('user/get', getUserApi);

export const {
  getUsersOrders,
  getUser,
  getUserIsLoading,
  getErrorUser,
  getOrdersIsLoading
} = userSlice.selectors;

export const { setErrorUser, resetUser } = userSlice.actions;

export const userSliceReducer = userSlice.reducer;
