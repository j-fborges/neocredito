# Neo Crédito — Teste Técnico Front End

Projeto desenvolvido para o módulo de Assinatura Eletrônica do portal interno de operações,
parte do processo seletivo para a vaga de Desenvolvedor Front End.

> [!IMPORTANT]
> <h3> Registro do Processo, Escolhas e Decisões de Projeto de Desenvolvimento</h3>
>
>Todas as escolhas de arquitetura, bibliotecas e padrões, assim como o registro do progresso de cada commit serão documentadas no arquivo [**DEV_CHOICES.md**](https://github.com/j-fborges/neocredito/blob/main/DEV_CHOICES.md).
>Lá você encontra justificativas completas alinhadas aos critérios de avaliação.
>
> **ATENÇÃO: A MOCKAGEM DA API SÓ FUNCIONA EM AMBIENTE DE DESENVOLVIMENTO**
> Todos os endpoints são simulados pelo MSW.
>

## Contexto do desafio

Implementar duas user stories em uma única aplicação coesa:
- US-01: Painel de Acompanhamento do CORBAN
- US-02: Validação do Dossiê de Assinatura

### Diagramas de relações entre Atores, Ações e Eventos das User Stories

[**US-01** - Diagrama de relações entre Atores, Ações e Eventos e Painel de Acompanhamento do CORBAN](./docs/diagrams/us01-sequence.md)

[**US-02** - Diagrama de relações entre Atores, Ações e Eventos e Painel de Validação do Dossiê de Assinatura](./docs/diagrams/us02-sequence.md)

### Diagramas de tipagem para o gerenciamento de estados Client

[Diagrama para Tipagem de Objetos](./docs/diagrams/objectTypes-draft.md)

[Diagrama para Tipagem de Estados Client - Redux Store e Slices](./docs/diagrams/stateTypes-draft.md)

## 🎯 Funcionalidades Implementadas

### US‑01 – Painel de Acompanhamento do CORBAN
- Listagem de propostas com **filtro por status** e **busca textual com debounce**.
- Indicador visual de novas assinaturas (✔️ pulsante + badge "Recém assinado").
- Modal (mobile) / painel lateral (desktop) com detalhes da proposta e tentativas de contato.
- **Notificações em tempo real**: polling silencioso a cada 30 s e toasts para novas assinaturas.
- Marcação de ciência: ao clicar na linha, o indicador de novo desaparece.

### US‑02 – Painel de Validação do Dossiê de Assinatura
- Exibição dos dados do assinante, endereço e coordenadas.
- **Mapa interativo** (Leaflet, carregado sob demanda) com fallback estático (OpenStreetMap).
- **Galeria de imagens** (selfie e documento) com zoom/pan e fechamento por clique no overlay ou ESC.
- Barra de **similaridade facial** (0‑100%) com cores indicativas.
- **Fluxo de decisão**: botões "Aprovado — dentro da política" e "Reprovado — fora da política" com modais de confirmação e justificativa obrigatória.
- Rascunho da justificativa persistido durante a edição.

---

## 🚀 Rodando o Projeto

```bash
# Pré‑requisito: Node.js 18+
git clone https://github.com/j-fborges/neocredito.git
cd neocredito
npm install
npm run dev          # Acessar http://localhost:5173
```

## 🧪 Rodando os Testes

```bash
npm test             # Executa testes (Vitest + Testing Library)
npm run test:coverage # Gera relatório de cobertura (HTML em coverage/)
```

Scripts adicionais disponíveis em `package.json`.

## 🛠️ Stack Tecnológico

| Tecnologia | Finalidade |
|-----------|-------------|
| Vite | Build tool / dev server |
| React 19 + TypeScript (strict) | UI e tipagem |
| Redux Toolkit + React Redux | Gerenciamento de estado |
| MSW | Mock da API |
| Tailwind CSS 4 | Estilização |
| React Router 7 | Roteamento |
| Vitest + Testing Library | Testes |
| Leaflet + react-leaflet | Mapa interativo |
| yet-another-react-lightbox | Lightbox com zoom/pan |
| ESLint + Prettier + EditorConfig | Qualidade de código |
| Husky + lint-staged + GitHub Actions | CI e pre‑commit |

## 📐 Decisões Técnicas

- **SPA com Vite** em vez de Next.js: módulo interno, sem necessidade de SSR.
- **Redux Toolkit** com slices independentes (propostas e dossiê), thunks tipados e hooks reutilizáveis.
- **Tailwind CSS** para estilização utilitária, com design baseado na identidade visual da Neo Crédito.
- **Simulação da API com MSW** reutilizada tanto no desenvolvimento quanto nos testes.
- **Internacionalização (apenas pt‑BR)** centralizada em `src/i18n/pt-BR.ts`, preparada para futura expansão.
- **Componentização** seguindo padrão de composição, presentacional/container e hooks customizados.

Para o detalhamento completo, veja [DEV_CHOICES.md](./DEV_CHOICES.md).

## 📂 Documentação Complementar

| Documento | Conteúdo |
|-----------|----------|
| [docs/about_hooks.md](./docs/about_hooks.md) | Hooks customizados e integração com Redux |
| [docs/about_endpoints_and_thunks.md](./docs/about_endpoints_and_thunks.md) | Endpoints MSW e thunks Redux |
| [docs/about_components.md](./docs/about_components.md) | Catálogo de componentes React |
| [docs/about_dx_and_ci.md](./docs/about_dx_and_ci.md) | CI, ESLint, Prettier, Husky |

## 📁 Estrutura Resumida

```
src/
├── components/
│   ├── eSignProposal/   # US‑01
│   └── eSignDossier/    # US‑02
├── hooks/               # Custom hooks
├── i18n/                # Tokens de internacionalização (pt‑BR)
├── mocks/               # Handlers MSW
├── pages/               # CorbanPanel e ESignDossierPanel
├── store/               # Slices Redux (SigningProposal, ESignDossier, Ui)
├── types/               # Tipos globais
└── test/                # Setup dos testes
docs/                    # Documentação complementar
```

## 🔮 O que eu faria com mais tempo

- **Testes E2E** com Playwright ou Cypress.
- **Auditoria de acessibilidade** automatizada (axe‑core, lighthouse).
- **Temas** (dark/light) e design tokens.
- **Pipeline de deploy** para staging (CD).
- **Cobertura mínima de testes** configurada no CI e Husky.
- **Paginação** na listagem de propostas.
- **Lista de dossiês pendentes** (com rota própria).

## 📄 Licença

Projeto desenvolvido exclusivamente como parte de processo seletivo.
