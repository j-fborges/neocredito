import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import App from "./App";
import { server } from "./mocks/server";
import { store } from "./store";

describe("App", () => {
  it("renders the header with the Neo Crédito logo", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </Provider>,
    );

    const logo = screen.getByAltText("Neo Crédito");
    expect(logo).toBeInTheDocument();
    expect(logo.closest("a")).toHaveAttribute("href", "/us-01");
  });

  it("redirects from / to /us-01 and renders the Corban panel", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      </Provider>,
    );

    expect(
      screen.getByText("Painel de Acompanhamento do CORBAN"),
    ).toBeInTheDocument();
  });

  it("renders the Corban panel directly on /us-01", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/us-01"]}>
          <App />
        </MemoryRouter>
      </Provider>,
    );

    expect(
      screen.getByText("Painel de Acompanhamento do CORBAN"),
    ).toBeInTheDocument();
  });

  it("shows a not found page for unknown routes", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/unknown"]}>
          <App />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText("Página não encontrada")).toBeInTheDocument();
  });

  it("shows a toast for new unread signed proposals", async () => {
    server.use(
      http.get("/api/proposals", () =>
        HttpResponse.json({
          data: [
            {
              id: "707",
              customer: { fullName: "Fernando Alves", cpf: "555.666.777-88" },
              status: "SIGNED",
              lastSigningEvent: "2025-05-13T04:00:00Z",
              notified: false,
              notifiable: true,
              details: { eSignLink: "", sentDate: "", contactAttempts: [] },
            },
          ],
        }),
      ),
    );

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/us-01"]}>
          <App />
        </MemoryRouter>
      </Provider>,
    );

    const toasts = await screen.findAllByText(
      /Nova assinatura: Fernando Alves/,
    );
    expect(toasts.length).toBeGreaterThan(0);
  });
});
