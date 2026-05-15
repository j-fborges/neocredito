import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, beforeEach } from "vitest";

import { server } from "../mocks/server";
import { store } from "../store";
import type { Dossier } from "../types/eSignDossier";

import ESignDossierPanel from "./ESignDossierPanel";

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
  selfieUrl: "https://placehold.co/300x400?text=Selfie",
  documentUrl: "https://placehold.co/400x300?text=Documento",
  facialSimilarity: 98.5,
  status: "PENDING_VALIDATION",
};

function renderComponent(initialRoute = "/us-02/101") {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/us-02/:id" element={<ESignDossierPanel />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
}

describe("ESignDossierPanel", () => {
  beforeEach(() => {
    server.use(
      http.get("/api/dossier/:proposalId", () =>
        HttpResponse.json({ data: mockDossier }),
      ),
    );
  });

  it("renders dossier data and action buttons", async () => {
    renderComponent();

    expect(
      await screen.findByText("Dossiê de E-Assinatura"),
    ).toBeInTheDocument();
    expect(screen.getByText(/Nº Proposta: 101/)).toBeInTheDocument();
    expect(screen.getByText("Pendente")).toBeInTheDocument();

    expect(screen.getByText(/João Silva/)).toBeInTheDocument();
    expect(screen.getByText(/123\.456\.789-00/)).toBeInTheDocument();
    expect(screen.getByText(/10\/05\/2025/)).toBeInTheDocument();
    expect(screen.getByText(/192\.168\.1\.10/)).toBeInTheDocument();

    const addressElements = screen.getAllByText(/Av\. Paulista, 1000/);
    expect(addressElements.length).toBeGreaterThanOrEqual(2);

    expect(screen.getByText("Localização geográfica:")).toBeInTheDocument();
    expect(screen.getByText(/Bela Vista/)).toBeInTheDocument();
    expect(screen.getByText(/01310-100/)).toBeInTheDocument();
    expect(screen.getByText(/São Paulo/)).toBeInTheDocument();
    expect(screen.getByText(/Brasil/)).toBeInTheDocument();
    expect(
      screen.getByText("Local aproximado da assinatura"),
    ).toBeInTheDocument();
    expect(screen.getByText(/-23\.5505, -46\.6333/)).toBeInTheDocument();

    const mapImage = screen.getByAltText(/Mapa da localização/);
    expect(mapImage).toBeInTheDocument();
    expect(mapImage.tagName).toBe("IMG");

    const selfieImg = screen.getByAltText("Selfie do assinante");
    expect(selfieImg).toHaveAttribute("src", mockDossier.selfieUrl);
    const docImg = screen.getByAltText("Documento do assinante");
    expect(docImg).toHaveAttribute("src", mockDossier.documentUrl);

    const similarityTexts = screen.getAllByText(/98[,.]5%/);
    expect(similarityTexts.length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText("Aprovado:")).toBeInTheDocument();
    expect(screen.getByText("Reprovado:")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    renderComponent();
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("shows error state", async () => {
    server.use(
      http.get("/api/dossier/:proposalId", () =>
        HttpResponse.json({ message: "Erro" }, { status: 500 }),
      ),
    );
    renderComponent();
    expect(await screen.findByText(/Erro:/)).toBeInTheDocument();
  });

  it("can approve a dossier", async () => {
    const updatedDossier = {
      ...mockDossier,
      status: "APPROVED_AWAITING_AUDIT" as const,
    };
    server.use(
      http.patch("/api/dossier/:proposalId/approve", () =>
        HttpResponse.json({ data: updatedDossier }),
      ),
    );

    renderComponent();
    await userEvent.click(await screen.findByText("Aprovado:"));
    expect(screen.getByText("Confirmar aprovação")).toBeInTheDocument();

    await userEvent.click(screen.getByText("Confirmar"));
    expect(
      await screen.findByText("Aprovado - Aguardando Auditoria"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Confirmar aprovação")).not.toBeInTheDocument();
  });

  it("can disapprove a dossier with a reason", async () => {
    const updatedDossier = {
      ...mockDossier,
      status: "DISAPPROVED_PENDING" as const,
    };
    server.use(
      http.patch("/api/dossier/:proposalId/disapprove", async ({ request }) => {
        const body = (await request.json()) as { reason: string };
        if (!body.reason?.trim()) {
          return HttpResponse.json(
            { message: "Motivo obrigatório" },
            { status: 400 },
          );
        }
        return HttpResponse.json({ data: updatedDossier });
      }),
    );

    renderComponent();
    await userEvent.click(await screen.findByText("Reprovado:"));
    expect(screen.getByText("Motivo da reprovação")).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText(
      "Descreva o motivo da reprovação.",
    );
    await userEvent.type(textarea, "Documento ilegível");
    await userEvent.click(screen.getByText("Reprovar"));

    expect(await screen.findByText("Reprovado - Pendente")).toBeInTheDocument();
    expect(screen.queryByText("Motivo da reprovação")).not.toBeInTheDocument();
  });

  it("disables action buttons when dossier is not pending", async () => {
    const approvedDossier = {
      ...mockDossier,
      status: "APPROVED_AWAITING_AUDIT" as const,
    };
    server.use(
      http.get("/api/dossier/:proposalId", () =>
        HttpResponse.json({ data: approvedDossier }),
      ),
    );

    renderComponent();
    await screen.findByText("Dossiê de E-Assinatura");

    expect(screen.getByText("Aprovado:")).toBeDisabled();
    expect(screen.getByText("Reprovado:")).toBeDisabled();
  });
});
