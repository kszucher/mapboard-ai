import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { editorSlice } from './clientSide/Reducer.ts';
import { api } from './serverSide/Api.ts';

export const appStore = configureStore({
  reducer: combineReducers({ api: api.reducer, editor: editorSlice.reducer }),
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }).concat(api.middleware),
});

export type RootState = ReturnType<typeof appStore.getState>;

export type AppDispatch = typeof appStore.dispatch;
