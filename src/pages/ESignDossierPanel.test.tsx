import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";

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
  selfieUrl: "https://via.placeholder.com/300x400",
  documentUrl: "https://via.placeholder.com/400x300",
  facialSimilarity: 98.5,
  status: "PENDING_VALIDATION",
};

describe("ESignDossierPanel", () => {
  it("renders dossier data correctly", async () => {
    server.use(
      http.get("/api/dossier/:proposalId", () =>
        HttpResponse.json({ data: mockDossier }),
      ),
    );

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/us-02/101"]}>
          <Routes>
            <Route path="/us-02/:id" element={<ESignDossierPanel />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    // Título principal
    expect(
      await screen.findByText("Dossiê de E-Assinatura"),
    ).toBeInTheDocument();

    // Número da proposta e status
    expect(screen.getByText(/Nº Proposta: 101/)).toBeInTheDocument();
    expect(screen.getByText("Pendente")).toBeInTheDocument();

    // Dados do assinante
    expect(screen.getByText(/João Silva/)).toBeInTheDocument();
    expect(screen.getByText(/123.456.789-00/)).toBeInTheDocument();
    expect(screen.getByText(/10\/05\/2025/)).toBeInTheDocument();
    expect(screen.getByText(/192.168.1.10/)).toBeInTheDocument();

    // Endereço aparece em dois lugares
    const addressElements = screen.getAllByText(/Av\. Paulista, 1000/);
    expect(addressElements.length).toBeGreaterThanOrEqual(2);

    // Seção de localização
    expect(screen.getByText("Localização geográfica:")).toBeInTheDocument();
    expect(screen.getByText(/Bela Vista/)).toBeInTheDocument();
    expect(screen.getByText(/01310-100/)).toBeInTheDocument();
    expect(screen.getByText(/São Paulo/)).toBeInTheDocument();
    expect(screen.getByText(/Brasil/)).toBeInTheDocument();
    expect(
      screen.getByText("Local aproximado da assinatura"),
    ).toBeInTheDocument();
    expect(screen.getByText(/-23.5505, -46.6333/)).toBeInTheDocument();

    // Mapa: como o Leaflet não funciona em jsdom, o fallback estático é exibido
    // Verificamos a presença da imagem do tile do OpenStreetMap
    const mapImage = screen.getByAltText(
      "Mapa da localização -23.5505, -46.6333",
    );
    expect(mapImage).toBeInTheDocument();
    expect(mapImage.tagName).toBe("IMG");
  });

  it("shows loading state", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/us-02/101"]}>
          <Routes>
            <Route path="/us-02/:id" element={<ESignDossierPanel />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("shows error state", async () => {
    server.use(
      http.get("/api/dossier/:proposalId", () =>
        HttpResponse.json({ message: "Erro" }, { status: 500 }),
      ),
    );

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/us-02/101"]}>
          <Routes>
            <Route path="/us-02/:id" element={<ESignDossierPanel />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(await screen.findByText(/Erro:/)).toBeInTheDocument();
  });
});
