import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type {
  ApiResponse,
  ESignStatus,
  SigningProposal,
} from "../types/signingProposal";

import type { RootState } from "./index";

export interface SigningProposalsState {
  itens: SigningProposal[];
  statusFilter: ESignStatus | null;
  searchTerm: string;
  loading: boolean;
  error: string | null;
  selectedProposal: SigningProposal | null;
  detailLoading: boolean;
}

const initialState: SigningProposalsState = {
  itens: [],
  statusFilter: null,
  searchTerm: "",
  loading: false,
  error: null,
  selectedProposal: null,
  detailLoading: false,
};

// Justificativa para o uso de fetchSigningProposals ao invés de filtrar uma lista cacheada em ./DEV_CHOICES no item 2.8.
export const fetchSigningProposals = createAsyncThunk<
  SigningProposal[],
  { status?: ESignStatus | null; search?: string } | void
>("propostas/fetchList", async (filters) => {
  const params = new URLSearchParams();
  if (filters) {
    if (filters.status) params.set("status", filters.status);
    if (filters.search) params.set("q", filters.search);
  }

  const res = await fetch(`/api/proposals?${params.toString()}`);

  if (!res.ok) {
    throw new Error(`Erro ${res.status} ao carregar propostas`);
  }

  const data: ApiResponse<SigningProposal[]> = await res.json();
  return data.data;
});

export const fetchSigningProposalsSilently = createAsyncThunk<
  SigningProposal[],
  { status?: ESignStatus | null; search?: string } | void
>("propostas/fetchListSilent", async (filters) => {
  const params = new URLSearchParams();
  if (filters) {
    if (filters.status) params.set("status", filters.status);
    if (filters.search) params.set("q", filters.search);
  }

  const res = await fetch(`/api/proposals?${params.toString()}`);

  if (!res.ok) {
    throw new Error(`Erro ${res.status} ao carregar propostas`);
  }

  const data: ApiResponse<SigningProposal[]> = await res.json();
  return data.data;
});

export const notifyProposal = createAsyncThunk<SigningProposal, string>(
  "propostas/notify",
  async (id) => {
    const res = await fetch(`/api/proposals/${id}/notify`, { method: "PATCH" });
    if (!res.ok) throw new Error(`Erro ${res.status}`);
    const data: ApiResponse<SigningProposal> = await res.json();
    return data.data;
  },
);

const SigningProposalSlice = createSlice({
  name: "SigningProposals",
  initialState,
  reducers: {
    setStatusFilter(state, action: PayloadAction<ESignStatus | null>) {
      state.statusFilter = action.payload;
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    setSelection(state, action: PayloadAction<SigningProposal>) {
      state.selectedProposal = action.payload;
    },
    clearSelection(state) {
      state.selectedProposal = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSigningProposals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSigningProposals.fulfilled, (state, action) => {
        state.loading = false;
        state.itens = action.payload;
      })
      .addCase(fetchSigningProposals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error loading proposals";
      })
      .addCase(fetchSigningProposalsSilently.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchSigningProposalsSilently.fulfilled, (state, action) => {
        state.itens = action.payload;
      })
      .addCase(fetchSigningProposalsSilently.rejected, (state, action) => {
        state.error = action.error.message ?? "Error loading proposals";
      })
      .addCase(notifyProposal.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(notifyProposal.fulfilled, (state, action) => {
        state.detailLoading = false;

        const index = state.itens.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.itens[index] = action.payload;
        }

        if (state.selectedProposal?.id === action.payload.id) {
          state.selectedProposal = action.payload;
        }
      })
      .addCase(notifyProposal.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.error.message ?? "Erro ao marcar notificação";
      });
  },
});

export const { setStatusFilter, setSearchTerm, setSelection, clearSelection } =
  SigningProposalSlice.actions;

export const selectProposals = (state: RootState) => state.signingProposals;

export default SigningProposalSlice.reducer;
