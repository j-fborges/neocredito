import { configureStore } from "@reduxjs/toolkit";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "../mocks/server";
import type { SigningProposal } from "../types/signingProposal";

import reducer, {
  clearSelection,
  fetchSigningProposals,
  notifyProposal,
  selectProposals,
  setSearchTerm,
  setSelection,
  setStatusFilter,
} from "./SigningProposalSlice";
import uiReducer from "./UiSlice";

function createTestStore() {
  return configureStore({
    reducer: { signingProposals: reducer, ui: uiReducer },
  });
}

describe("SigningProposalSlice", () => {
  describe("initial state", () => {
    it("should have the correct default values", () => {
      const store = createTestStore();
      const state = store.getState().signingProposals;

      expect(state.itens).toEqual([]);
      expect(state.statusFilter).toBeNull();
      expect(state.searchTerm).toBe("");
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.selectedProposal).toBeNull();
      expect(state.detailLoading).toBe(false);
    });
  });

  describe("reducers", () => {
    it("setStatusFilter should update the filter", () => {
      const store = createTestStore();
      store.dispatch(setStatusFilter("SIGNED"));
      expect(store.getState().signingProposals.statusFilter).toBe("SIGNED");

      store.dispatch(setStatusFilter(null));
      expect(store.getState().signingProposals.statusFilter).toBeNull();
    });

    it("setSearchTerm should update the search term", () => {
      const store = createTestStore();
      store.dispatch(setSearchTerm("João"));
      expect(store.getState().signingProposals.searchTerm).toBe("João");
    });

    it("setSelection should store the proposal and clear detailError", () => {
      const store = createTestStore();
      const mockProposal: SigningProposal = {
        id: "999",
        status: "AWAITING",
        lastSigningEvent: new Date().toISOString(),
        notified: false,
        notifiable: true,
        customer: { fullName: "Test", cpf: "000" },
        details: { eSignLink: "", sentDate: "", contactAttempts: [] },
      };

      store.dispatch(setSelection(mockProposal));
      const state = store.getState().signingProposals;
      expect(state.selectedProposal).toEqual(mockProposal);
    });

    it("clearSelection should remove the proposal and clear error", () => {
      const store = createTestStore();
      store.dispatch(
        setSelection({
          id: "1",
          status: "SIGNED",
          lastSigningEvent: "",
          notifiable: true,
          notified: false,
          customer: { fullName: "A", cpf: "1" },
          details: { eSignLink: "", sentDate: "", contactAttempts: [] },
        }),
      );
      store.dispatch(clearSelection());
      const state = store.getState().signingProposals;
      expect(state.selectedProposal).toBeNull();
    });
  });

  describe("selectors", () => {
    it("selectProposals should return the whole slice state", () => {
      const store = createTestStore();
      const slice = selectProposals(store.getState());
      expect(slice).toEqual(store.getState().signingProposals);
    });
  });

  describe("thunk fetchSigningProposals", () => {
    it("should handle pending and fulfilled states correctly", async () => {
      const store = createTestStore();

      const thunkPromise = store.dispatch(fetchSigningProposals());

      expect(store.getState().signingProposals.loading).toBe(true);
      expect(store.getState().signingProposals.error).toBeNull();

      await thunkPromise;

      const state = store.getState().signingProposals;
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.itens.length).toBeGreaterThan(0);
      state.itens.forEach((item) => {
        expect(item).toHaveProperty("id");
        expect(item).toHaveProperty("customer.fullName");
      });
    });

    it("should pass status and search filters to the request", async () => {
      const store = createTestStore();

      await store.dispatch(
        fetchSigningProposals({ status: "SIGNED", search: "joão" }),
      );

      const state = store.getState().signingProposals;

      state.itens.forEach((item) => {
        expect(item.status).toBe("SIGNED");
        const matches =
          item.customer.fullName.toLowerCase().includes("joão") ||
          item.id.includes("joão");
        expect(matches).toBe(true);
      });
    });

    it("should handle rejected state when the API fails", async () => {
      server.use(
        http.get("/api/proposals", () =>
          HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
          ),
        ),
      );

      const store = createTestStore();
      await store.dispatch(fetchSigningProposals());

      const state = store.getState().signingProposals;
      expect(state.loading).toBe(false);
      expect(state.error).toBeDefined();
      expect(state.itens).toEqual([]);
    });
  });

  describe("thunk notifyProposal", () => {
    it("should update the notified field of a proposal", async () => {
      const mockProposal: SigningProposal = {
        id: "707",
        status: "SIGNED",
        notified: false,
        notifiable: true,
        customer: { fullName: "Test", cpf: "111" },
        lastSigningEvent: "",
        details: { eSignLink: "", sentDate: "", contactAttempts: [] },
      };

      server.use(
        http.get("/api/proposals", () =>
          HttpResponse.json({ data: [mockProposal] }),
        ),
        http.patch("/api/proposals/707/notify", () =>
          HttpResponse.json({ data: { ...mockProposal, notified: true } }),
        ),
      );

      const store = createTestStore();

      await store.dispatch(fetchSigningProposals());
      expect(store.getState().signingProposals.itens[0].notified).toBe(false);

      await store.dispatch(notifyProposal("707"));

      const state = store.getState().signingProposals;
      expect(state.itens[0].notified).toBe(true);
    });

    it("should handle errors gracefully", async () => {
      server.use(
        http.patch("/api/proposals/707/notify", () =>
          HttpResponse.json({ message: "Erro" }, { status: 500 }),
        ),
      );

      const store = createTestStore();
      await store.dispatch(notifyProposal("707"));

      const state = store.getState().signingProposals;
      expect(state.error).toBeDefined();
    });
  });
});
