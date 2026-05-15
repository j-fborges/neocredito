import { configureStore } from "@reduxjs/toolkit";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "../mocks/server";
import type { Dossier } from "../types/eSignDossier";

import reducer, {
  fetchDossier,
  approveDossier,
  disapproveDossier,
  clearDossier,
} from "./ESignDossierSlice";

function createTestStore() {
  return configureStore({ reducer: { esignDossier: reducer } });
}

const mockDossier: Dossier = {
  proposalId: "101",
  signatory: {
    fullName: "João Silva",
    cpf: "123.456.789-00",
    signatureDate: "2025-05-10T10:30:00Z",
    ip: "192.168.1.10",
    coordinates: { lat: -23.5505, lon: -46.6333 },
    address: "Av. Paulista, 1000",
    neighborhood: "Bela Vista",
    zipCode: "01310-100",
    city: "São Paulo",
    country: "Brasil",
  },
  selfieUrl: "/mocks/mock_selfie1.png",
  documentUrl: "/mocks/mock_doc1.png",
  facialSimilarity: 98.5,
  status: "PENDING_VALIDATION",
};

describe("ESignDossierSlice", () => {
  describe("initial state", () => {
    it("should have correct default values", () => {
      const store = createTestStore();
      const state = store.getState().esignDossier;
      expect(state.data).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.actionInProgress).toBeNull();
    });
  });

  describe("clearDossier", () => {
    it("should reset state to initial", async () => {
      server.use(
        http.get("/api/dossier/:proposalId", () =>
          HttpResponse.json({ data: mockDossier }),
        ),
      );

      const store = createTestStore();
      await store.dispatch(fetchDossier("101"));
      expect(store.getState().esignDossier.data).not.toBeNull();

      store.dispatch(clearDossier());
      const state = store.getState().esignDossier;
      expect(state.data).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.actionInProgress).toBeNull();
    });
  });

  describe("thunk fetchDossier", () => {
    it("should handle pending and fulfilled states", async () => {
      server.use(
        http.get("/api/dossier/:proposalId", () =>
          HttpResponse.json({ data: mockDossier }),
        ),
      );

      const store = createTestStore();
      const thunk = store.dispatch(fetchDossier("101"));
      expect(store.getState().esignDossier.loading).toBe(true);

      await thunk;
      const state = store.getState().esignDossier;
      expect(state.loading).toBe(false);
      expect(state.data).toEqual(mockDossier);
    });

    it("should handle rejected state", async () => {
      server.use(
        http.get("/api/dossier/:proposalId", () =>
          HttpResponse.json({ message: "Erro" }, { status: 500 }),
        ),
      );

      const store = createTestStore();
      await store.dispatch(fetchDossier("101"));
      const state = store.getState().esignDossier;
      expect(state.loading).toBe(false);
      expect(state.error).toBeDefined();
    });
  });

  describe("thunk approveDossier", () => {
    it("should set actionInProgress and update status on success", async () => {
      const updatedDossier = {
        ...mockDossier,
        status: "APPROVED_AWAITING_AUDIT" as const,
      };
      server.use(
        http.patch("/api/dossier/:proposalId/approve", () =>
          HttpResponse.json({ data: updatedDossier }),
        ),
      );

      const store = createTestStore();
      await store.dispatch(fetchDossier("101"));

      const thunk = store.dispatch(approveDossier("101"));
      expect(store.getState().esignDossier.actionInProgress).toBe("approving");

      await thunk;
      const state = store.getState().esignDossier;
      expect(state.actionInProgress).toBeNull();
      expect(state.data?.status).toBe("APPROVED_AWAITING_AUDIT");
    });

    it("should set error and clear actionInProgress on failure", async () => {
      server.use(
        http.patch("/api/dossier/:proposalId/approve", () =>
          HttpResponse.json({ message: "Erro" }, { status: 500 }),
        ),
      );

      const store = createTestStore();
      await store.dispatch(fetchDossier("101"));
      await store.dispatch(approveDossier("101"));

      const state = store.getState().esignDossier;
      expect(state.actionInProgress).toBeNull();
      expect(state.error).toBeDefined();
    });
  });

  describe("thunk disapproveDossier", () => {
    it("should set actionInProgress and update status on success", async () => {
      const updatedDossier = {
        ...mockDossier,
        status: "DISAPPROVED_PENDING" as const,
      };
      server.use(
        http.patch(
          "/api/dossier/:proposalId/disapprove",
          async ({ request }) => {
            const body = (await request.json()) as { reason: string };
            if (!body.reason?.trim()) {
              return HttpResponse.json(
                { message: "Motivo obrigatório" },
                { status: 400 },
              );
            }
            return HttpResponse.json({ data: updatedDossier });
          },
        ),
      );

      const store = createTestStore();
      await store.dispatch(fetchDossier("101"));

      const thunk = store.dispatch(
        disapproveDossier({ proposalId: "101", reason: "Documento ilegível" }),
      );
      expect(store.getState().esignDossier.actionInProgress).toBe(
        "disapproving",
      );

      await thunk;
      const state = store.getState().esignDossier;
      expect(state.actionInProgress).toBeNull();
      expect(state.data?.status).toBe("DISAPPROVED_PENDING");
    });

    it("should set error and clear actionInProgress on failure", async () => {
      server.use(
        http.patch("/api/dossier/:proposalId/disapprove", () =>
          HttpResponse.json({ message: "Erro" }, { status: 500 }),
        ),
      );

      const store = createTestStore();
      await store.dispatch(fetchDossier("101"));
      await store.dispatch(
        disapproveDossier({ proposalId: "101", reason: "Falha" }),
      );

      const state = store.getState().esignDossier;
      expect(state.actionInProgress).toBeNull();
      expect(state.error).toBeDefined();
    });
  });
});
