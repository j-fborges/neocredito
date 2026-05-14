import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "./index";

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface UiState {
  toasts: Toast[];
}

const initialState: UiState = {
  toasts: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    addToast(state, action: PayloadAction<Omit<Toast, "id">>) {
      const id = crypto.randomUUID();
      state.toasts.push({ ...action.payload, id });
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const { addToast, removeToast } = uiSlice.actions;
export const selectToasts = (state: RootState) => state.ui.toasts;
export default uiSlice.reducer;
