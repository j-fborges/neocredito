import { describe, expect, it } from "vitest";

import type { ApiResponse, SigningProposal } from "../types/signingProposal";

describe("SigningProposal Handlers (via MSW global)", () => {
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
});
