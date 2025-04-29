import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { api } from './api.ts';
import { slice } from './reducer.ts';

export const appStore = configureStore({
  reducer: combineReducers({ api: api.reducer, slice: slice.reducer }),
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }).concat(api.middleware),
});

export type RootState = ReturnType<typeof appStore.getState>;

export type AppDispatch = typeof appStore.dispatch;
