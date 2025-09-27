import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { api } from './api.ts';
import { blockWhenEditingMiddleware } from './middleware-edit.ts';
import { slice } from './reducer.ts';

const rootReducer = combineReducers({
  slice: slice.reducer,
  api: api.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof appStore.dispatch;

export const appStore = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }).concat(api.middleware).concat(blockWhenEditingMiddleware),
});
