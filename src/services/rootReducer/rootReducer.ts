import { combineReducers } from '@reduxjs/toolkit';
import { feedSlice } from '../slices/feedSlice/feedSlice';
import { userSlice } from '../slices/userSlice/userSlice';
import { constructorSlice } from '../slices/constructorSlice/constructorSlice';

export const rootReducer = combineReducers({
  feed: feedSlice.reducer,
  user: userSlice.reducer,
  burgerConstructor: constructorSlice.reducer
});
