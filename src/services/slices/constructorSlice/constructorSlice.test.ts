import { jest } from '@jest/globals';
import {
  addIngredient,
  ConstructorItems,
  constructorReducer,
  ConstructorState,
  getIngredients,
  getIngredientsAsync,
  getIngredientsBun,
  getIngredientsMain,
  getIngredientsSauce,
  handleCloseItem,
  handleMoveDownItem,
  handleMoveUpItem,
  initialState,
  orderAsync
} from './constructorSlice';
import store from '../../store';
import { TOrder } from '@utils-types';

jest.mock('uuid', () => ({
  v4: () => 'mock_id'
}));

const ingredientsMain = [
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa093e',
    name: 'Филе Люминесцентного тетраодонтимформа',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/meat-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa093f',
    name: 'Мясо бессмертных моллюсков Protostomia',
    type: 'main',
    proteins: 433,
    fat: 244,
    carbohydrates: 33,
    calories: 420,
    price: 1337,
    image: 'https://code.s3.yandex.net/react/code/meat-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-02-large.png'
  }
];

const mockState: ConstructorState = {
  ingredients: [
    {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa093e',
      name: 'Филе Люминесцентного тетраодонтимформа',
      type: 'main',
      proteins: 44,
      fat: 26,
      carbohydrates: 85,
      calories: 643,
      price: 988,
      image: 'https://code.s3.yandex.net/react/code/meat-03.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa093f',
      name: 'Мясо бессмертных моллюсков Protostomia',
      type: 'main',
      proteins: 433,
      fat: 244,
      carbohydrates: 33,
      calories: 420,
      price: 1337,
      image: 'https://code.s3.yandex.net/react/code/meat-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-02-large.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa0940',
      name: 'Говяжий метеорит (отбивная)',
      type: 'main',
      proteins: 800,
      fat: 800,
      carbohydrates: 300,
      calories: 2674,
      price: 3000,
      image: 'https://code.s3.yandex.net/react/code/meat-04.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa0946',
      name: 'Хрустящие минеральные кольца',
      type: 'main',
      proteins: 808,
      fat: 689,
      carbohydrates: 609,
      calories: 986,
      price: 300,
      image: 'https://code.s3.yandex.net/react/code/mineral_rings.png',
      image_mobile:
        'https://code.s3.yandex.net/react/code/mineral_rings-mobile.png',
      image_large:
        'https://code.s3.yandex.net/react/code/mineral_rings-large.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa0947',
      name: 'Плоды Фалленианского дерева',
      type: 'main',
      proteins: 20,
      fat: 5,
      carbohydrates: 55,
      calories: 77,
      price: 874,
      image: 'https://code.s3.yandex.net/react/code/sp_1.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sp_1-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sp_1-large.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa0943',
      name: 'Соус фирменный Space Sauce',
      type: 'sauce',
      proteins: 50,
      fat: 22,
      carbohydrates: 11,
      calories: 14,
      price: 80,
      image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa0944',
      name: 'Соус традиционный галактический',
      type: 'sauce',
      proteins: 42,
      fat: 24,
      carbohydrates: 42,
      calories: 99,
      price: 15,
      image: 'https://code.s3.yandex.net/react/code/sauce-03.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-03-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-03-large.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa0945',
      name: 'Соус с шипами Антарианского плоскоходца',
      type: 'sauce',
      proteins: 101,
      fat: 99,
      carbohydrates: 100,
      calories: 100,
      price: 88,
      image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png'
    }
  ],
  modalOrderData: null,
  orderRequest: false,
  constructorItems: {
    bun: null,
    ingredients: []
  },
  ingredientsMain: [...ingredientsMain],
  ingredientsBun: [
    {
      _id: '643d69a5c3f7b9001cfa0940',
      name: 'Говяжий метеорит (отбивная)',
      type: 'main',
      proteins: 800,
      fat: 800,
      carbohydrates: 300,
      calories: 2674,
      price: 3000,
      image: 'https://code.s3.yandex.net/react/code/meat-04.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa0946',
      name: 'Хрустящие минеральные кольца',
      type: 'main',
      proteins: 808,
      fat: 689,
      carbohydrates: 609,
      calories: 986,
      price: 300,
      image: 'https://code.s3.yandex.net/react/code/mineral_rings.png',
      image_mobile:
        'https://code.s3.yandex.net/react/code/mineral_rings-mobile.png',
      image_large:
        'https://code.s3.yandex.net/react/code/mineral_rings-large.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa0947',
      name: 'Плоды Фалленианского дерева',
      type: 'main',
      proteins: 20,
      fat: 5,
      carbohydrates: 55,
      calories: 77,
      price: 874,
      image: 'https://code.s3.yandex.net/react/code/sp_1.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sp_1-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sp_1-large.png'
    }
  ],
  ingredientsSauce: [
    {
      _id: '643d69a5c3f7b9001cfa0943',
      name: 'Соус фирменный Space Sauce',
      type: 'sauce',
      proteins: 50,
      fat: 22,
      carbohydrates: 11,
      calories: 14,
      price: 80,
      image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa0944',
      name: 'Соус традиционный галактический',
      type: 'sauce',
      proteins: 42,
      fat: 24,
      carbohydrates: 42,
      calories: 99,
      price: 15,
      image: 'https://code.s3.yandex.net/react/code/sauce-03.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-03-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-03-large.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa0945',
      name: 'Соус с шипами Антарианского плоскоходца',
      type: 'sauce',
      proteins: 101,
      fat: 99,
      carbohydrates: 100,
      calories: 100,
      price: 88,
      image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png'
    }
  ],
  ingredientsIsLoading: false
};

const orderExpected: TOrder = {
  _id: 'mock_id',
  createdAt: '',
  ingredients: [],
  name: '',
  number: 0,
  status: '',
  updatedAt: ''
};

const constructorIngredientsMain = ingredientsMain.map((x) => ({
  ...x,
  id: 'mock_id'
}));

const stateConstructorItems: ConstructorState = {
  ...mockState,
  constructorItems: {
    bun: null,
    ingredients: constructorIngredientsMain
  }
};

const mockIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
};

describe('constructorSlice', () => {
  test('All ingredients selector', () => {
    const result = getIngredients({ burgerConstructor: mockState });
    expect(result).toEqual(mockState.ingredients);
  });
  test('Main ingredients selector', () => {
    const result = getIngredientsMain({ burgerConstructor: mockState });
    expect(result).toEqual(mockState.ingredientsMain);
  });
  test('Bun ingredients selector', () => {
    const result = getIngredientsBun({ burgerConstructor: mockState });
    expect(result).toEqual(mockState.ingredientsBun);
  });
  test('Sauce ingredients selector', () => {
    const result = getIngredientsSauce({ burgerConstructor: mockState });
    expect(result).toEqual(mockState.ingredientsSauce);
  });
  test('Get ingredients async', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ data: mockState.ingredients, success: true })
      } as Response)
    );
    await store.dispatch(getIngredientsAsync());
    expect(fetch).toHaveBeenCalled();
    expect(store.getState().burgerConstructor?.ingredients).toEqual(
      mockState.ingredients
    );
    expect(store.getState().burgerConstructor?.ingredientsIsLoading).toEqual(
      false
    );
  });
  test('Get ingredients async pending', async () => {
    const action = { type: getIngredientsAsync.pending.type };
    expect(
      constructorReducer(initialState, action).ingredientsIsLoading
    ).toEqual(true);
  });
  test('Get ingredients async rejected', async () => {
    const action = { type: getIngredientsAsync.rejected.type };
    expect(
      constructorReducer(initialState, action).ingredientsIsLoading
    ).toEqual(false);
  });
  test('Add ingredient', () => {
    const expectedRes: ConstructorItems = {
      bun: null,
      ingredients: [{ ...mockIngredient, id: 'mock_id' }]
    };
    store.dispatch(addIngredient(mockIngredient));
    expect(store.getState().burgerConstructor?.constructorItems).toEqual(
      expectedRes
    );
  });
  test('Move down ingredient', () => {
    const constructorIngredientsMain = ingredientsMain.map((x) => ({
      ...x,
      id: 'mock_id'
    }));
    const state: ConstructorState = {
      ...mockState,
      constructorItems: {
        bun: null,
        ingredients: constructorIngredientsMain
      }
    };
    const action = {
      type: handleMoveDownItem.type,
      payload: state.constructorItems.ingredients[0]
    };
    expect(constructorReducer(state, action)).toEqual({
      ...state,
      constructorItems: {
        bun: null,
        ingredients: [
          constructorIngredientsMain[1],
          constructorIngredientsMain[0],
          constructorIngredientsMain[2]
        ]
      }
    });
  });
  test('Move up ingredient', () => {
    const action = {
      type: handleMoveUpItem.type,
      payload: stateConstructorItems.constructorItems.ingredients[1]
    };
    expect(constructorReducer(stateConstructorItems, action)).toEqual({
      ...stateConstructorItems,
      constructorItems: {
        bun: null,
        ingredients: [
          constructorIngredientsMain[1],
          constructorIngredientsMain[0],
          constructorIngredientsMain[2]
        ]
      }
    });
  });
  test('Delete ingredient', () => {
    const action = {
      type: handleCloseItem.type,
      payload: stateConstructorItems.constructorItems.ingredients[0]
    };
    expect(constructorReducer(stateConstructorItems, action)).toEqual({
      ...stateConstructorItems,
      constructorItems: {
        bun: null,
        ingredients: [
          constructorIngredientsMain[1],
          constructorIngredientsMain[2]
        ]
      }
    });
  });
  test('Order fulfilled', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ order: orderExpected, success: true })
      } as Response)
    );
    await store.dispatch(orderAsync([]));
    expect(fetch).toHaveBeenCalled();
    expect(store.getState().burgerConstructor?.modalOrderData).toEqual(
      orderExpected
    );
    expect(store.getState().burgerConstructor?.ingredientsIsLoading).toEqual(
      false
    );
  });
  test('Constructor clear after order', () => {
    const action = { type: orderAsync.fulfilled.type, payload: [] };
    expect(
      constructorReducer(stateConstructorItems, action).constructorItems
    ).toEqual(initialState.constructorItems);
  });
  test('Order pending', () => {
    const action = { type: orderAsync.pending.type, payload: [] };
    expect(
      constructorReducer(stateConstructorItems, action).orderRequest
    ).toEqual(true);
  });
  test('Order rejected', () => {
    const action = { type: orderAsync.rejected.type, payload: [] };
    expect(
      constructorReducer(stateConstructorItems, action).orderRequest
    ).toEqual(false);
  });
  afterAll(() => {
    jest.clearAllMocks();
  });
});
