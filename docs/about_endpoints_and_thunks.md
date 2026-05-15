# Documentação de Endpoints da API Mockada (MSW) e Thunks Redux

Análise completa dos endpoints de API mockados com MSW e dos thunks
assíncronos da Redux Store, incluindo responsabilidades, funcionalidades,
relacionamentos e fluxos de dados. Baseado na implementação final do projeto.

## 📡 Endpoints da API Mockada (MSW Handlers)

### Tabela Resumo de Endpoints

| Endpoint                              | Método | Descrição                              | Status Codes      | Dados de Entrada                                | Dados de Saída                |
|---------------------------------------|--------|----------------------------------------|-------------------|-------------------------------------------------|-------------------------------|
| `/api/proposals`                      | GET    | Listar propostas com filtros           | 200               | query: status, q                                | `{ data: SigningProposal[] }` |
| `/api/proposals/:id`                  | GET    | Obter detalhes de uma proposta         | 200, 404          | params: id                                      | `{ data: SigningProposal }`   |
| `/api/proposals/:id/notify`           | PATCH  | Marcar proposta como notificada        | 200, 404          | params: id                                      | `{ data: SigningProposal }`   |
| `/api/dossier/:proposalId`            | GET    | Obter dossiê de assinatura             | 200, 404          | params: proposalId                              | `{ data: Dossier }`           |
| `/api/dossier/:proposalId/approve`    | PATCH  | Aprovar dossiê                         | 200, 404          | params: proposalId                              | `{ data: Dossier }`           |
| `/api/dossier/:proposalId/disapprove` | PATCH  | Reprovar dossiê com motivo obrigatório | 200, 400, 404     | params: proposalId, body: `{ reason: string }`  | `{ data: Dossier }`           |

---

## 🔍 Detalhamento dos Endpoints

### GET /api/proposals
- **Responsabilidade:** Listar propostas de assinatura com suporte a filtro por status e busca textual.
- **Query Parameters:**
  - `status` (opcional): Um dos valores `AWAITING`, `SIGNED`, `REJECTED`, `EXPIRED`.
  - `q` (opcional): Termo buscado no nome do cliente (`customer.fullName`) ou no `id` (case‑insensitive).
- **Processamento:**
  1. Clona o array mutável `proposals`.
  2. Aplica `filter` se `status` foi informado.
  3. Aplica `filter` adicional se `q` foi informado.
  4. Retorna `{ data: resultado }`.
- **Resposta:** `200 OK` com `ApiResponse<SigningProposal[]>`.
- **Exemplo:** `GET /api/proposals?status=SIGNED&q=joão`

### GET /api/proposals/:id
- **Responsabilidade:** Retornar os dados completos de uma única proposta.
- **Path Parameter:** `id` – string com o identificador da proposta.
- **Processamento:** Busca exata em `proposals`; se não encontrada, retorna `404`.
- **Resposta:** `200 OK` com `ApiResponse<SigningProposal>` ou `404 Not Found`.

### PATCH /api/proposals/:id/notify
- **Responsabilidade:** Marcar a proposta como notificada (o operador tomou ciência).
- **Path Parameter:** `id`.
- **Processamento:** Localiza a proposta em `proposals` e define `notified = true`.
- **Resposta:** `200 OK` com a proposta atualizada, ou `404`.
- **Idempotência:** Sim – múltiplas chamadas mantêm `notified = true`.

### GET /api/dossier/:proposalId
- **Responsabilidade:** Obter o dossiê completo de validação para uma proposta.
- **Path Parameter:** `proposalId`.
- **Processamento:** Busca no array `dossiers` (3 itens mockados). Se não encontrado, `404`.
- **Resposta:** `200 OK` com `ApiResponse<Dossier>`, incluindo dados do assinante, coordenadas, URLs de selfie/documento e similaridade.

### PATCH /api/dossier/:proposalId/approve
- **Responsabilidade:** Aprovar o dossiê, alterando o status para `APPROVED_AWAITING_AUDIT`.
- **Path Parameter:** `proposalId`.
- **Processamento:** Localiza o dossiê e define `status = "APPROVED_AWAITING_AUDIT"`. Não valida o estado anterior.
- **Resposta:** `200 OK` com o dossiê atualizado, ou `404`.

### PATCH /api/dossier/:proposalId/disapprove
- **Responsabilidade:** Reprovar o dossiê, exigindo um motivo.
- **Path Parameter:** `proposalId`.
- **Body:** `{ reason: string }` (obrigatório e não vazio após `trim()`).
- **Processamento:**
  1. Encontra o dossiê.
  2. Lê o body JSON; se `reason` estiver ausente ou vazio, retorna `400 Bad Request` com `{ message: "Motivo obrigatório" }`.
  3. Define `status = "DISAPPROVED_PENDING"`.
- **Resposta:** `200 OK`, `400` ou `404`.

---

## ⚙️ Redux Thunks (Ações Assíncronas)

### Tabela Resumo de Thunks

| Thunk                            | Slice                  | Endpoint                               | Loading? | Principais Ações no State               |
|----------------------------------|------------------------|----------------------------------------|----------|------------------------------------------|
| `fetchSigningProposals`          | SigningProposalSlice   | GET /api/proposals                     | Sim      | `loading`, `error`, `itens`              |
| `fetchSigningProposalsSilently`  | SigningProposalSlice   | GET /api/proposals                     | Não*     | `itens` (sem `loading`)                  |
| `notifyProposal`                 | SigningProposalSlice   | PATCH /api/proposals/:id/notify        | Não**    | Atualiza item na lista e seleção atual    |
| `fetchDossier`                   | ESignDossierSlice      | GET /api/dossier/:id                   | Sim      | `loading`, `error`, `data`               |
| `approveDossier`                 | ESignDossierSlice      | PATCH /api/dossier/:id/approve         | Progresso| `actionInProgress`, `data`               |
| `disapproveDossier`              | ESignDossierSlice      | PATCH /api/dossier/:id/disapprove      | Progresso| `actionInProgress`, `data`               |

*`fetchSigningProposalsSilently` não aciona `loading` para evitar flicker na UI durante o polling.*
**`notifyProposal` não manipula flags de loading; a atualização é imediata e transparente.*

---

## 🔗 Detalhamento dos Thunks

### fetchSigningProposals
- **Assinatura:** `fetchSigningProposals(filters?: { status?: ESignStatus | null; search?: string })`
- **Endpoint:** GET `/api/proposals?status=...&q=...`
- **Ciclo de vida:**
  - *pending:* `loading = true`, `error = null`
  - *fulfilled:* `loading = false`, `itens = payload`; se houver `selectedProposal`, sincroniza com o item correspondente.
  - *rejected:* `loading = false`, `error = action.error.message`
- **Uso:** Busca inicial, filtros manuais e mudança de filtro/termo de busca.

### fetchSigningProposalsSilently
- **Assinatura:** `fetchSigningProposalsSilently()` (sem argumentos – utilizado apenas pelo polling)
- **Endpoint:** GET `/api/proposals` (sem filtros)
- **Ciclo de vida:**
  - *pending:* nenhum indicador visual.
  - *fulfilled:* `itens = payload`; sincroniza `selectedProposal` se existir.
  - *rejected:* apenas define `error` silenciosamente.
- **Uso:** Polling automático a cada 30 segundos (`useProposalPolling`), mantendo a lista atualizada sem interferir na experiência do usuário.

### notifyProposal
- **Assinatura:** `notifyProposal(proposalId: string)`
- **Endpoint:** PATCH `/api/proposals/:id/notify`
- **Ciclo de vida:**
  - *fulfilled:* atualiza o item correspondente em `itens` e, se for a proposta atualmente selecionada, atualiza também `selectedProposal`.
  - *rejected:* `error` com a mensagem.
- **Uso:** Chamado quando o operador clica em uma linha da tabela para ver detalhes, efetivando a notificação.

### fetchDossier
- **Assinatura:** `fetchDossier(proposalId: string)`
- **Endpoint:** GET `/api/dossier/:proposalId`
- **Ciclo de vida:**
  - *pending:* `loading = true`, `error = null`
  - *fulfilled:* `loading = false`, `data = payload`
  - *rejected:* `loading = false`, `error = action.error.message`
- **Uso:** Carregamento inicial do painel de validação de dossiê.

### approveDossier
- **Assinatura:** `approveDossier(proposalId: string)`
- **Endpoint:** PATCH `/api/dossier/:proposalId/approve`
- **Ciclo de vida:**
  - *pending:* `actionInProgress = "approving"` (desabilita botões)
  - *fulfilled:* `actionInProgress = null`, `data = payload`
  - *rejected:* `actionInProgress = null`, `error = action.error.message`
- **Uso:** Disparado pelo hook `useDossierActions` ao confirmar a aprovação.

### disapproveDossier
- **Assinatura:** `disapproveDossier({ proposalId: string; reason: string })`
- **Endpoint:** PATCH `/api/dossier/:proposalId/disapprove` com body `{ reason }`
- **Ciclo de vida:**
  - *pending:* `actionInProgress = "disapproving"`
  - *fulfilled:* `actionInProgress = null`, `data = payload`
  - *rejected:* `actionInProgress = null`, `error = action.error.message`; se o endpoint retornar 400, o erro é propagado.
- **Uso:** Chamado pelo hook `useDossierActions` após o operador informar o motivo da reprovação.

---

## 🔀 Relacionamentos entre Endpoints e Thunks

| Thunk                            | Endpoint                               | Sincroniza com                       |
|----------------------------------|----------------------------------------|--------------------------------------|
| `fetchSigningProposals`          | GET `/api/proposals`                   | Tabela de propostas                  |
| `fetchSigningProposalsSilently`  | GET `/api/proposals`                   | Polling automático                   |
| `notifyProposal`                 | PATCH `/api/proposals/:id/notify`      | Item na lista e `selectedProposal`   |
| `fetchDossier`                   | GET `/api/dossier/:id`                 | Página de validação                  |
| `approveDossier`                 | PATCH `/api/dossier/:id/approve`       | Estado `data` e `actionInProgress`   |
| `disapproveDossier`              | PATCH `/api/dossier/:id/disapprove`    | Estado `data` e `actionInProgress`   |

---

## 📊 Fluxo de Dados Resumido

```
Componentes React → Hooks Customizados → Redux Thunks → MSW Handlers
```

Exemplo para busca:
1. `FilterBar` → `useProposalSearch.handleInputChange`
2. `useProposalSearch` (via `useDebounce`) → dispatch `fetchSigningProposals`
3. `fetchSigningProposals` → GET `/api/proposals?q=...`
4. MSW filtra `proposals` e retorna `{ data }`
5. Slice atualiza `itens` e `loading`
6. `ProposalContent` reage ao novo estado.

Exemplo para aprovação de dossiê:
1. `ActionButtons` → `DecisionSection` → `useDossierActions.handleApprove`
2. Modal confirmação → dispatch `approveDossier`
3. `approveDossier` → PATCH `/api/dossier/:id/approve`
4. MSW altera `status` para `APPROVED_AWAITING_AUDIT`
5. Slice atualiza `data` e limpa `actionInProgress`
6. `useDossierActions` fecha modal, `UiSlice` exibe toast.

---

## 🛡️ Tratamento de Erros e Validações

- Todos os thunks que acessam a rede têm tratamento de `rejected` que armazena a mensagem em `state.error`.
- `disapproveDossier` é o único thunk que envia payload; o endpoint valida `reason` (não vazio) e retorna `400` se inválido. O thunk propaga o erro para que a UI possa reagir.
- Endpoints `GET` e `PATCH` para propostas e dossiês retornam `404` quando o ID não é encontrado.
- `fetchSigningProposalsSilently` captura erros silenciosamente para não poluir a UI durante o polling.
- A flag `actionInProgress` nos thunks de dossiê impede ações duplicadas enquanto uma requisição está em andamento.
