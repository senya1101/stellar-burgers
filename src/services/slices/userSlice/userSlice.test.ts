import {
  getUser,
  getUserAsync,
  getUsersOrdersAsync,
  initialState,
  loginUser,
  logoutUser,
  registerUser,
  resetUser,
  updateUser,
  userSliceReducer,
  UserState
} from './userSlice';
import store from '../../store';

const mockState: UserState = {
  user: {
    email: 'a',
    name: 'b'
  },
  isLoading: false,
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
  error: '',
  ordersIsLoading: false
};

const mockNewUserData = {
  name: 'aa',
  email: 'a@a'
};

describe('userSlice', () => {
  test('Reset state', () => {
    expect(userSliceReducer(mockState, { type: resetUser.type })).toEqual(
      initialState
    );
  });
  test('User selector', () => {
    const res = getUser({ user: mockState });
    expect(res).toEqual(mockState.user);
  });
  test('Get user async', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            user: mockState.user
          })
      } as Response)
    );
    await store.dispatch(getUserAsync());
    expect(store.getState().user?.user).toEqual(mockState.user);
    expect(store.getState().user?.isLoading).toBe(false);
  });
  test('Get user pending', () => {
    const action = { type: getUserAsync.pending.type };
    expect(userSliceReducer(initialState, action).isLoading).toBe(true);
  });
  test('Get user rejected', () => {
    const action = { type: getUserAsync.rejected.type };
    expect(userSliceReducer(initialState, action).isLoading).toBe(false);
  });
  test('Login user pending', () => {
    const action = {
      type: loginUser.pending.type,
      payload: { email: '', password: '' }
    };
    expect(userSliceReducer(initialState, action).isLoading).toBe(true);
  });
  test('Login user rejected', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('error')));
    await store.dispatch(loginUser({ email: '', password: '' }));
    expect(store.getState().user?.user).toEqual(initialState.user);
    expect(store.getState().user?.isLoading).toBe(false);
    expect(store.getState().user?.error).toBe('error');
  });
  test('Login user fulfilled', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            user: mockState.user
          })
      } as Response)
    );
    await store.dispatch(loginUser({ email: '', password: '' }));
    expect(store.getState().user?.user).toEqual(mockState.user);
    expect(store.getState().user?.isLoading).toBe(false);
  });
  test('Register user pending', () => {
    const action = {
      type: registerUser.pending.type,
      payload: { email: '', password: '' }
    };
    expect(userSliceReducer(initialState, action).isLoading).toBe(true);
  });
  test('Register user rejected', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('error')));
    await store.dispatch(registerUser({ email: '', password: '', name: '' }));
    expect(store.getState().user?.user).toEqual(initialState.user);
    expect(store.getState().user?.isLoading).toBe(false);
    expect(store.getState().user?.error).toBe('error');
  });
  test('Register user fulfilled', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            user: mockState.user
          })
      } as Response)
    );
    await store.dispatch(registerUser({ email: '', password: '', name: '' }));
    expect(store.getState().user?.user).toEqual(mockState.user);
    expect(store.getState().user?.isLoading).toBe(false);
  });
  test('Get users orders pending', () => {
    const action = {
      type: getUsersOrdersAsync.pending.type
    };
    expect(userSliceReducer(initialState, action).ordersIsLoading).toBe(true);
  });
  test('Get users orders rejected', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('error')));
    await store.dispatch(getUsersOrdersAsync());
    expect(store.getState().user?.ordersIsLoading).toBe(false);
  });
  test('Get users orders fulfilled', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            orders: mockState.orders
          })
      } as Response)
    );
    await store.dispatch(getUsersOrdersAsync());
    expect(store.getState().user?.orders).toEqual(mockState.orders);
    expect(store.getState().user?.ordersIsLoading).toBe(false);
  });
  afterEach(() => {
    store.dispatch(resetUser()); //reset state of store
  });
  afterAll(() => {
    jest.clearAllMocks();
  });
});

describe('Logout/update user', () => {
  beforeEach(async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            user: mockState.user
          })
      } as Response)
    );
    await store.dispatch(loginUser({ email: '', password: '' }));
  });
  test('Logout user pending', () => {
    const action = {
      type: logoutUser.pending.type,
      payload: { email: '', password: '' }
    };
    expect(userSliceReducer(initialState, action).isLoading).toBe(true);
  });
  test('Logout user rejected', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('error')));
    await store.dispatch(logoutUser());
    expect(store.getState().user?.user).toEqual(mockState.user);
    expect(store.getState().user?.isLoading).toBe(false);
  });
  test('Logout user fulfilled', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            user: mockState.user
          })
      } as Response)
    );
    await store.dispatch(logoutUser());
    expect(store.getState().user?.user).toEqual(initialState.user);
    expect(store.getState().user?.isLoading).toBe(false);
    expect(store.getState().user?.orders).toEqual([]);
  });
  test('Update user pending', () => {
    const action = {
      type: updateUser.pending.type,
      payload: mockNewUserData
    };
    expect(userSliceReducer(initialState, action).isLoading).toBe(true);
  });
  test('Update user rejected', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('error')));
    await store.dispatch(updateUser(mockNewUserData));
    expect(store.getState().user?.user).toEqual(mockState.user);
    expect(store.getState().user?.isLoading).toBe(false);
  });
  test('Update user fulfilled', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            user: mockNewUserData
          })
      } as Response)
    );
    await store.dispatch(updateUser(mockNewUserData));
    expect(store.getState().user?.user).toEqual(mockNewUserData);
    expect(store.getState().user?.isLoading).toBe(false);
  });
  afterAll(() => {
    jest.clearAllMocks();
  });
});
