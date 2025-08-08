import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi, orderBurgerApi } from '@api';

export interface ConstructorItems {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

export interface ConstructorState {
  ingredientsBun: TIngredient[];
  ingredientsMain: TIngredient[];
  ingredientsSauce: TIngredient[];
  ingredients: TIngredient[];
  ingredientsIsLoading: boolean;
  constructorItems: ConstructorItems;
  orderRequest: boolean;
  modalOrderData: TOrder | null;
}

const initialState: ConstructorState = {
  ingredients: [],
  modalOrderData: null,
  orderRequest: false,
  constructorItems: {
    bun: null,
    ingredients: []
  },
  ingredientsBun: [],
  ingredientsMain: [],
  ingredientsSauce: [],
  ingredientsIsLoading: false
};
export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload;
        } else {
          state.constructorItems.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuidv4() }
      })
    },
    handleMoveDownItem: (state, { payload }) => {
      state.constructorItems.ingredients.forEach((x, ind) => {
        if (
          x._id === payload._id &&
          ind + 1 < state.constructorItems.ingredients.length
        ) {
          [
            state.constructorItems.ingredients[ind],
            state.constructorItems.ingredients[ind + 1]
          ] = [
            state.constructorItems.ingredients[ind + 1],
            state.constructorItems.ingredients[ind]
          ];
        }
      });
    },
    handleMoveUpItem: (state, { payload }) => {
      state.constructorItems.ingredients.forEach((x, ind) => {
        if (x._id === payload._id && ind - 1 >= 0) {
          [
            state.constructorItems.ingredients[ind],
            state.constructorItems.ingredients[ind - 1]
          ] = [
            state.constructorItems.ingredients[ind - 1],
            state.constructorItems.ingredients[ind]
          ];
        }
      });
    },
    handleCloseItem: (state, { payload }) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter((x) => x._id !== payload._id);
    }
  },
  selectors: {
    getIngredientsBun: (state) => state.ingredientsBun,
    getIngredientsMain: (state) => state.ingredientsMain,
    getIngredientsSauce: (state) => state.ingredientsSauce,
    getIngredientsIsLoading: (state) => state.ingredientsIsLoading,
    getConstructorItems: (state) => state.constructorItems,
    getOrderRequest: (state) => state.orderRequest,
    getOrderModalData: (state) => state.modalOrderData,
    getIngredients: (state) => state.ingredients
  },
  extraReducers: (builder) =>
    builder
      .addCase(getIngredientsAsync.pending, (state) => {
        state.ingredientsIsLoading = true;
      })
      .addCase(getIngredientsAsync.rejected, (state) => {
        state.ingredientsIsLoading = false;
      })
      .addCase(getIngredientsAsync.fulfilled, (state, { payload }) => {
        state.ingredientsIsLoading = false;
        state.ingredientsBun = payload.filter((x) => x.type === 'bun');
        state.ingredientsSauce = payload.filter((x) => x.type === 'sauce');
        state.ingredientsMain = payload.filter((x) => x.type === 'main');
        state.ingredients = payload;
      })
      .addCase(orderAsync.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(orderAsync.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(orderAsync.fulfilled, (state, { payload }) => {
        state.orderRequest = false;
        state.modalOrderData = payload;
        state.constructorItems = {
          bun: null,
          ingredients: []
        };
      })
});

export const getIngredientsAsync = createAsyncThunk(
  'ingredients/getIngredients',
  getIngredientsApi
);

export const orderAsync = createAsyncThunk('order', async (data: string[]) => {
  const res = await orderBurgerApi(data);
  return res.order;
});

export const {
  getIngredientsIsLoading,
  getIngredientsSauce,
  getIngredientsMain,
  getIngredientsBun,
  getConstructorItems,
  getOrderRequest,
  getOrderModalData,
  getIngredients
} = constructorSlice.selectors;

export const {
  addIngredient,
  handleMoveDownItem,
  handleMoveUpItem,
  handleCloseItem
} = constructorSlice.actions;
