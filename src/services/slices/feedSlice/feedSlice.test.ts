import { afterAll } from '@jest/globals';
import {
  feedSliceReducer,
  FeedState,
  getFeedAsync, getFeedIsLoading,
  getFeedOrders,
  getFeedTotal,
  getFeedTotalToday, getOrderByIdAsync,
  initialState
} from './feedSlice';
import store from '../../store';
import { TOrder } from '@utils-types';

const mockState: FeedState = {
  total: 2,
  totalToday: 0,
  orders: [
    {
      _id: '68a4d289673086001ba8397d',
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa093e',
        '643d69a5c3f7b9001cfa0943',
        '643d69a5c3f7b9001cfa093d'
      ],
      status: 'done',
      name: 'Space флюоресцентный люминесцентный бургер',
      createdAt: '2025-08-19T19:37:45.744Z',
      updatedAt: '2025-08-19T19:37:46.579Z',
      number: 86837
    },
    {
      _id: '68a4d067673086001ba83971',
      ingredients: [
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa0949',
        '643d69a5c3f7b9001cfa0945',
        '643d69a5c3f7b9001cfa093c'
      ],
      status: 'done',
      name: 'Краторный экзо-плантаго антарианский бургер',
      createdAt: '2025-08-19T19:28:39.363Z',
      updatedAt: '2025-08-19T19:28:40.178Z',
      number: 86836
    }
  ],
  feedIsLoading: false,
  currentOrderModal: null,
  orderModalIsLoading: false
};

describe('FeedSlice', () => {
  test('Feed orders selector', () => {
    const res = getFeedOrders({ feed: mockState });
    expect(res).toEqual(mockState.orders);
  });
  test('Feed total selector', () => {
    const res = getFeedTotal({ feed: mockState });
    expect(res).toEqual(mockState.total);
  });
  test('Feed total today selector', () => {
    const res = getFeedTotalToday({ feed: mockState });
    expect(res).toEqual(mockState.totalToday);
  });
  test('Feed is loading selector', () => {
    const res = getFeedIsLoading({ feed: mockState });
    expect(res).toEqual(mockState.feedIsLoading);
  });
  test('Get feed async', async () => {
    const expectedRes = {
      success: true,
      orders: mockState.orders,
      total: mockState.total,
      totalToday: mockState.totalToday
    };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(expectedRes)
      } as Response)
    );
    await store.dispatch(getFeedAsync());
    expect(store.getState().feed?.orders).toEqual(expectedRes.orders);
    expect(store.getState().feed?.total).toEqual(expectedRes.total);
    expect(store.getState().feed?.totalToday).toEqual(expectedRes.totalToday);
  });
  test('Feed pending', () => {
    const action = { type: getFeedAsync.pending.type };
    expect(feedSliceReducer(initialState, action).feedIsLoading).toEqual(true);
  });
  test('Feed rejected', () => {
    const action = { type: getFeedAsync.rejected.type };
    expect(feedSliceReducer(initialState, action).feedIsLoading).toEqual(false);
  });
  test('Get order by id', async () => {
    const orderExpected: TOrder = {
      _id: 'mock_id',
      createdAt: '',
      ingredients: [],
      name: '',
      number: 0,
      status: '',
      updatedAt: ''
    };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ orders: [orderExpected], success: true })
      } as Response)
    );
    await store.dispatch(getOrderByIdAsync(0));
    expect(store.getState().feed?.currentOrderModal).toEqual(orderExpected);
    expect(store.getState().feed?.orderModalIsLoading).toEqual(false);
  });
  afterAll(() => {
    jest.clearAllMocks();
  });
});
