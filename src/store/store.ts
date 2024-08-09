import { combineReducers, configureStore } from '@reduxjs/toolkit';
import searchSlice from './searchSlice';

const rootReducer = combineReducers({
  search: searchSlice,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;
