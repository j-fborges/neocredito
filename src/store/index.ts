import { configureStore } from "@reduxjs/toolkit";

import ESignDossierReducer from "./ESignDossierSlice";
import SigningProposalsReducer from "./SigningProposalSlice";
import UiReducer from "./UiSlice";

export const store = configureStore({
  reducer: {
    signingProposals: SigningProposalsReducer,
    ui: UiReducer,
    eSignDossier: ESignDossierReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = (
  dispatch: AppDispatch,
  getState: () => RootState,
) => ReturnType;
