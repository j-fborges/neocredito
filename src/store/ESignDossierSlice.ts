import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type { ApiResponse } from "../types/apiResponse";
import type { Dossier, DossierState } from "../types/eSignDossier";

import type { RootState } from "./index";

const initialState: DossierState = {
  data: null,
  loading: false,
  error: null,
  actionInProgress: null,
};

export const fetchDossier = createAsyncThunk<Dossier, string>(
  "dossier/fetch",
  async (proposalId) => {
    const res = await fetch(`/api/dossier/${proposalId}`);
    if (!res.ok) throw new Error(`Erro ${res.status}`);
    const json: ApiResponse<Dossier> = await res.json();
    return json.data;
  },
);

const esignDossierSlice = createSlice({
  name: "esignDossier",
  initialState,
  reducers: {
    clearDossier: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDossier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDossier.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDossier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error loading dossier";
      });
  },
});

export const { clearDossier } = esignDossierSlice.actions;

export const selectDossier = (state: RootState) => state.eSignDossier;

export default esignDossierSlice.reducer;
