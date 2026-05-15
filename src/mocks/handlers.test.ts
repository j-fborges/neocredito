import { describe, expect, it, beforeEach } from "vitest";

import { server } from "../mocks/server";
import type { ApiResponse } from "../types/apiResponse";
import type { Dossier } from "../types/eSignDossier";
import { ESIGN_STATUS, type SigningProposal } from "../types/signingProposal";

import {
  handlers,
  initialProposals,
  resetDossiers,
  resetProposals,
} from "./handlers";

describe("SigningProposal Handlers (via MSW global)", () => {
  beforeEach(() => {
    resetProposals();
    resetDossiers();
    server.resetHandlers(...handlers);
  });

  it("GET /api/proposals returns SigningProposal array with ApiResponse", async () => {
    const res = await fetch("/api/proposals");
    const body: ApiResponse<SigningProposal[]> = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);

    body.data.forEach((proposal) => {
      expect(proposal).toHaveProperty("id");
      expect(proposal).toHaveProperty("status");
      expect(proposal.customer).toHaveProperty("fullName");
      expect(proposal.details).toHaveProperty("contactAttempts");
    });
  });

  it("GET /api/proposals?status=SIGNED returns only signed proposals", async () => {
    const res = await fetch("/api/proposals?status=SIGNED");
    const body: ApiResponse<SigningProposal[]> = await res.json();
    expect(body.data.every((p) => p.status === "SIGNED")).toBe(true);
  });

  it("GET /api/proposals?q=maria searches by name or id", async () => {
    const res = await fetch("/api/proposals?q=maria");
    const body: ApiResponse<SigningProposal[]> = await res.json();
    expect(body.data.length).toBeGreaterThan(0);
    body.data.forEach((p) => {
      const matchName = p.customer.fullName.toLowerCase().includes("maria");
      const matchId = p.id.toLowerCase().includes("maria");
      expect(matchName || matchId).toBe(true);
    });
  });

  it("GET /api/proposals/:id returns details of existing proposal", async () => {
    const res = await fetch("/api/proposals/101");
    const body: ApiResponse<SigningProposal> = await res.json();
    expect(res.status).toBe(200);
    expect(body.data.id).toBe("101");
    expect(body.data.details.eSignLink).toBeDefined();
    expect(body.data.details.contactAttempts.length).toBeGreaterThan(0);
  });

  it("GET /api/proposals/:id nonexisting proposal returns 404", async () => {
    const res = await fetch("/api/proposals/9999");
    expect(res.status).toBe(404);
  });

  it("should only have notified=true when status is SIGNED", async () => {
    const res = await fetch("/api/proposals");
    const body: ApiResponse<SigningProposal[]> = await res.json();
    body.data.forEach((proposal) => {
      if (proposal.notified) {
        expect(proposal.status).toBe("SIGNED");
      }
    });
  });

  it("should have at least one notified proposal with SIGNED status", async () => {
    const res = await fetch("/api/proposals");
    const body: ApiResponse<SigningProposal[]> = await res.json();
    const notifiedSigned = body.data.filter(
      (p) => p.notified && p.status === "SIGNED",
    );
    expect(notifiedSigned.length).toBeGreaterThan(0);
  });

  it("PATCH /api/proposals/:id/notify should set notified to true", async () => {
    const res = await fetch("/api/proposals/707/notify", { method: "PATCH" });
    expect(res.status).toBe(200);
    const body: ApiResponse<SigningProposal> = await res.json();
    expect(body.data.notified).toBe(true);

    const res2 = await fetch("/api/proposals/707");
    const body2: ApiResponse<SigningProposal> = await res2.json();
    expect(body2.data.notified).toBe(true);
  });

  it("PATCH on nonexistent id returns 404", async () => {
    const res = await fetch("/api/proposals/9999/notify", { method: "PATCH" });
    expect(res.status).toBe(404);
  });

  it("AWAITING proposals without contact attempts should not be eligible for auto-signing", () => {
    const awaitingWithoutAttempts = initialProposals.filter(
      (p) =>
        p.status === ESIGN_STATUS.AWAITING &&
        p.notifiable &&
        p.details.contactAttempts.length === 0,
    );
    expect(awaitingWithoutAttempts.length).toBeGreaterThan(0);
    awaitingWithoutAttempts.forEach((p) => {
      expect(p.details.contactAttempts).toHaveLength(0);
    });
  });

  it("GET /api/dossier/:proposalId returns dossier for existing proposal", async () => {
    const res = await fetch("/api/dossier/101");
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.data).toHaveProperty("proposalId", "101");
    expect(body.data.signatory).toHaveProperty("fullName");
    expect(body.data).toHaveProperty("facialSimilarity");
    expect(body.data).toHaveProperty("status");
  });

  it("GET /api/dossier/:proposalId returns 404 for nonexistent", async () => {
    const res = await fetch("/api/dossier/9999");
    expect(res.status).toBe(404);
  });

  it("PATCH /api/dossier/:proposalId/approve should set status to APPROVED_AWAITING_AUDIT", async () => {
    const res = await fetch("/api/dossier/101/approve", { method: "PATCH" });
    expect(res.status).toBe(200);
    const body: ApiResponse<Dossier> = await res.json();
    expect(body.data.status).toBe("APPROVED_AWAITING_AUDIT");

    const res2 = await fetch("/api/dossier/101");
    const body2: ApiResponse<Dossier> = await res2.json();
    expect(body2.data.status).toBe("APPROVED_AWAITING_AUDIT");
  });

  it("PATCH /api/dossier/:proposalId/approve with nonexistent id returns 404", async () => {
    const res = await fetch("/api/dossier/9999/approve", { method: "PATCH" });
    expect(res.status).toBe(404);
  });

  it("PATCH /api/dossier/:proposalId/disapprove should set status to DISAPPROVED_PENDING with valid reason", async () => {
    const res = await fetch("/api/dossier/101/disapprove", {
      method: "PATCH",
      body: JSON.stringify({ reason: "Documento ilegível" }),
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status).toBe(200);
    const body: ApiResponse<Dossier> = await res.json();
    expect(body.data.status).toBe("DISAPPROVED_PENDING");

    const res2 = await fetch("/api/dossier/101");
    const body2: ApiResponse<Dossier> = await res2.json();
    expect(body2.data.status).toBe("DISAPPROVED_PENDING");
  });

  it("PATCH /api/dossier/:proposalId/disapprove with empty reason returns 400", async () => {
    const res = await fetch("/api/dossier/101/disapprove", {
      method: "PATCH",
      body: JSON.stringify({ reason: "" }),
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status).toBe(400);
  });

  it("PATCH /api/dossier/:proposalId/disapprove with nonexistent id returns 404", async () => {
    const res = await fetch("/api/dossier/9999/disapprove", {
      method: "PATCH",
      body: JSON.stringify({ reason: "qualquer" }),
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status).toBe(404);
  });
});
