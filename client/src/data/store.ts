import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { editorSlice } from './reducer.ts';
import { api } from './api.ts';

export const appStore = configureStore({
  reducer: combineReducers({ api: api.reducer, editor: editorSlice.reducer }),
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }).concat(api.middleware),
});

export type RootState = ReturnType<typeof appStore.getState>;

export type AppDispatch = typeof appStore.dispatch;
