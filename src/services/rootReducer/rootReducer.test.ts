import { rootReducer } from './rootReducer';
import { initialState as feedState } from '../slices/feedSlice/feedSlice';
import { initialState as constructorState } from '../slices/constructorSlice/constructorSlice';
import { initialState as userState } from '../slices/userSlice/userSlice';

const mockState = {
  user: userState,
  feed: feedState,
  burgerConstructor: constructorState
};

describe('root reducer', () => {
  test('Call unknown action', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    expect(rootReducer(mockState, action)).toEqual(mockState);
  });
  test('Call with undefined state', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    expect(rootReducer(undefined, action)).toEqual(mockState);
  });
});
