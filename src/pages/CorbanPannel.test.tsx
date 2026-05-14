import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, afterEach, vi } from "vitest";

import { server } from "../mocks/server";
import { store } from "../store";
import type { SigningProposal } from "../types/signingProposal";

import CorbanPannel from "./CorbanPannel";

const mockProposals: SigningProposal[] = [
  {
    id: "101",
    customer: { fullName: "João Silva", cpf: "123.456.789-00" },
    status: "SIGNED",
    lastSigningEvent: "2025-05-10T10:30:00Z",
    notified: true,
    notifiable: true,
    details: {
      eSignLink: "https://link.exemplo",
      sentDate: "2025-05-09T09:00:00Z",
      contactAttempts: [],
    },
  },
  {
    id: "202",
    customer: { fullName: "Maria Souza", cpf: "987.654.321-00" },
    status: "AWAITING",
    lastSigningEvent: "2025-05-08T08:00:00Z",
    notified: false,
    notifiable: false,
    details: {
      eSignLink: "https://link.exemplo",
      sentDate: "2025-05-08T08:00:00Z",
      contactAttempts: [],
    },
  },
  {
    id: "707",
    customer: { fullName: "Fernando Alves", cpf: "555.666.777-88" },
    status: "SIGNED",
    lastSigningEvent: "2025-05-15T18:00:00Z",
    notified: false,
    notifiable: true,
    details: {
      eSignLink: "https://link.exemplo",
      sentDate: "2025-05-13T07:00:00Z",
      contactAttempts: [],
    },
  },
];

describe("CorbanPannel", () => {
  afterEach(() => {
    server.resetHandlers();
  });

  it("renders the title and filter bar", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/us-01"]}>
          <CorbanPannel />
        </MemoryRouter>
      </Provider>,
    );

    expect(
      screen.getByText("Painel de Acompanhamento do CORBAN"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Assinaturas Eletrônicas de Propostas em Operação:"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Buscar por nome ou ID..."),
    ).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("shows loading state initially and then list", async () => {
    server.use(
      http.get("/api/proposals", () => {
        return HttpResponse.json({ data: mockProposals });
      }),
    );

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/us-01"]}>
          <CorbanPannel />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();

    const rows = await screen.findAllByRole("row");
    expect(rows).toHaveLength(4);

    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText("Maria Souza")).toBeInTheDocument();
  });

  it("shows empty state when no proposals are returned", async () => {
    server.use(
      http.get("/api/proposals", () => {
        return HttpResponse.json({ data: [] });
      }),
    );

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/us-01"]}>
          <CorbanPannel />
        </MemoryRouter>
      </Provider>,
    );

    expect(
      await screen.findByText("Nenhuma proposta encontrada"),
    ).toBeInTheDocument();
  });

  it("shows error state when request fails", async () => {
    server.use(
      http.get("/api/proposals", () => {
        return HttpResponse.json({ message: "Erro interno" }, { status: 500 });
      }),
    );

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/us-01"]}>
          <CorbanPannel />
        </MemoryRouter>
      </Provider>,
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(/erro/i);
  });

  it("filters proposals by status and search term", async () => {
    server.use(
      http.get("/api/proposals", ({ request }) => {
        const url = new URL(request.url);
        const status = url.searchParams.get("status");
        const search = url.searchParams.get("q")?.toLowerCase();
        let filtered = mockProposals;
        if (status) {
          filtered = filtered.filter((p) => p.status === status);
        }
        if (search) {
          filtered = filtered.filter(
            (p) =>
              p.customer.fullName.toLowerCase().includes(search) ||
              p.id.includes(search),
          );
        }
        return HttpResponse.json({ data: filtered });
      }),
    );

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/us-01"]}>
          <CorbanPannel />
        </MemoryRouter>
      </Provider>,
    );

    await screen.findAllByRole("row");
    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText("Maria Souza")).toBeInTheDocument();

    const select = screen.getByRole("combobox");
    const searchInput = screen.getByPlaceholderText("Buscar por nome ou ID...");

    await userEvent.selectOptions(select, "SIGNED");
    expect(await screen.findByText("João Silva")).toBeInTheDocument();
    expect(screen.queryByText("Maria Souza")).not.toBeInTheDocument();

    await userEvent.selectOptions(select, "");
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, "Maria");

    await waitFor(() => {
      expect(screen.getByText("Maria Souza")).toBeInTheDocument();
      expect(screen.queryByText("João Silva")).not.toBeInTheDocument();
    });
  });

  it("opens and closes the details modal when clicking a row", async () => {
    server.use(
      http.get("/api/proposals", () => {
        return HttpResponse.json({ data: mockProposals });
      }),
    );

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/us-01"]}>
          <CorbanPannel />
        </MemoryRouter>
      </Provider>,
    );

    const rows = await screen.findAllByRole("row");
    const firstProposalRow = rows[1];
    await userEvent.click(firstProposalRow);

    expect(await screen.findByText("123.456.789-00")).toBeInTheDocument();
    expect(screen.getByLabelText("Fechar modal")).toBeInTheDocument();

    await userEvent.click(screen.getByLabelText("Fechar modal"));
    expect(screen.queryByText("123.456.789-00")).not.toBeInTheDocument();
  });

  it("dispatches notifyProposal when clicking a notifiable unread row", async () => {
    const patchHandler = vi.fn();
    server.use(
      http.get("/api/proposals", () =>
        HttpResponse.json({ data: mockProposals }),
      ),
      http.patch("/api/proposals/:id/notify", ({ params }) => {
        patchHandler(params.id);
        const updated = {
          ...mockProposals.find((p) => p.id === params.id)!,
          notified: true,
        };
        return HttpResponse.json({ data: updated });
      }),
    );

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/us-01"]}>
          <CorbanPannel />
        </MemoryRouter>
      </Provider>,
    );

    const rows = await screen.findAllByRole("row");
    const fernandoRow = rows[3];
    await userEvent.click(fernandoRow);

    expect(patchHandler).toHaveBeenCalledWith("707");

    expect(await screen.findByText("555.666.777-88")).toBeInTheDocument();
  });
});
