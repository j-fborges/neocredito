import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import App from "./App";
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
});
