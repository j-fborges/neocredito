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
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    const json: ApiResponse<Dossier> = await res.json();
    return json.data;
  },
);

export const approveDossier = createAsyncThunk<Dossier, string>(
  "dossier/approve",
  async (proposalId) => {
    const res = await fetch(`/api/dossier/${proposalId}/approve`, {
      method: "PATCH",
    });
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    const json: ApiResponse<Dossier> = await res.json();
    return json.data;
  },
);

export const disapproveDossier = createAsyncThunk<
  Dossier,
  { proposalId: string; reason: string }
>("dossier/disapprove", async ({ proposalId, reason }) => {
  const res = await fetch(`/api/dossier/${proposalId}/disapprove`, {
    method: "PATCH",
    body: JSON.stringify({ reason }),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  const json: ApiResponse<Dossier> = await res.json();
  return json.data;
});

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
      })
      .addCase(approveDossier.pending, (state) => {
        state.actionInProgress = "approving";
      })
      .addCase(approveDossier.fulfilled, (state, action) => {
        state.data = action.payload;
        state.actionInProgress = null;
      })
      .addCase(approveDossier.rejected, (state, action) => {
        state.actionInProgress = null;
        state.error = action.error.message ?? "Error approving dossier";
      })
      .addCase(disapproveDossier.pending, (state) => {
        state.actionInProgress = "disapproving";
      })
      .addCase(disapproveDossier.fulfilled, (state, action) => {
        state.data = action.payload;
        state.actionInProgress = null;
      })
      .addCase(disapproveDossier.rejected, (state, action) => {
        state.actionInProgress = null;
        state.error = action.error.message ?? "Error disapproving dossier";
      });
  },
});

export const { clearDossier } = esignDossierSlice.actions;

export const selectDossier = (state: RootState) => state.eSignDossier;

export default esignDossierSlice.reducer;
