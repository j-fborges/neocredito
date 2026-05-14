import { describe, expect, it, beforeEach } from "vitest";

import { server } from "../mocks/server";
import type { ApiResponse, SigningProposal } from "../types/signingProposal";

import { handlers, resetProposals } from "./handlers";

describe("SigningProposal Handlers (via MSW global)", () => {
  beforeEach(() => {
    resetProposals();
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
});
