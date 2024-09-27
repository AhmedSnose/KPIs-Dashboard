import { configureStore } from '@reduxjs/toolkit';
import loadingSlice from './loadingSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      loadingSlice,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];