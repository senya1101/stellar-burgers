import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder, TUser } from '@utils-types';
import {
  getOrdersApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TRegisterData,
  updateUserApi
} from '@api';
import { deleteCookie, setCookie } from '../../utils/cookie';

export interface UserState {
  user: TUser | null;
  isLoading: boolean;
  orders: TOrder[];
}

const initialState: UserState = {
  user: null,
  isLoading: false,
  orders: []
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    getUser: (state) => state.user,
    getUserIsLoading: (state) => state.isLoading,
    getUsersOrders: (state) => state.orders
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(logoutUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = null;
      })
      .addCase(getUsersOrdersAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsersOrdersAsync.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getUsersOrdersAsync.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.orders = payload;
      });
  }
});

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }: { email: string; password: string }) => {
    const res = await loginUserApi({ email, password });
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async ({ email, name, password }: TRegisterData) => {
    const res = await registerUserApi({ email, name, password });
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (user: Partial<TRegisterData>) => {
    const res = await updateUserApi(user);
    return res.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  const { success } = await logoutApi();
  if (success) deleteCookie('accessToken');
  return success;
});

export const getUsersOrdersAsync = createAsyncThunk(
  'user/orders',
  async () => await getOrdersApi()
);

export const { getUsersOrders, getUser, getUserIsLoading } =
  userSlice.selectors;
