import { configureStore } from "@reduxjs/toolkit";

import SigningProposalsReducer from "./SigningProposalSlice";
import uiReducer from "./UiSlice";

export const store = configureStore({
  reducer: {
    signingProposals: SigningProposalsReducer,
    ui: uiReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = (
  dispatch: AppDispatch,
  getState: () => RootState,
) => ReturnType;
