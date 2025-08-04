import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getIngredientsApi, orderBurgerApi } from '@api';

export interface ConstructorItems {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

export interface IngredientsState {
  ingredientsInit: boolean;
  ingredientsBun: TIngredient[];
  ingredientsMain: TIngredient[];
  ingredientsSauce: TIngredient[];
  ingredientsIsLoading: boolean;
  constructorItems: ConstructorItems;
  orderRequest: boolean;
  modalOrderData: TOrder | null;
}

const initialState: IngredientsState = {
  ingredientsInit: false,
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
  name: 'ingredients',
  initialState,
  reducers: {
    addIngredient: (state, action) => {
      if (action.payload.type === 'bun')
        state.constructorItems.bun = action.payload;
      else state.constructorItems.ingredients.push(action.payload);
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
    getIngredientsInit: (state) => state.ingredientsInit,
    getIngredients: (state) =>
      state.ingredientsSauce.concat(state.ingredientsBun, state.ingredientsMain)
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
        state.ingredientsInit = true;
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
  async () => await getIngredientsApi()
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
  getIngredientsInit,
  getIngredients
} = constructorSlice.selectors;

export const {
  addIngredient,
  handleMoveDownItem,
  handleMoveUpItem,
  handleCloseItem
} = constructorSlice.actions;
