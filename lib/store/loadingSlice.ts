import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface StateType {
  isLoading: boolean;
}

const initialState: StateType = {
  isLoading: true,
};

export const counterSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    changeLoadingState: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { changeLoadingState } = counterSlice.actions;

export const selectCount = (state: RootState) => state.loadingSlice;

export default counterSlice.reducer;
