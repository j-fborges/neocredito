# Relatório Consolidado de Hooks Customizados

Hooks que encapsulam lógica de negócio, integração com a Redux Store e
comunicação com componentes UI. Todos seguem padrões de tipagem estrita,
memoização quando necessário e limpeza de efeitos colaterais.

## 📋 Tabela Resumo

| Hook                      | Tipo               | Responsabilidade Principal                | Redux Slice(s)              | Ações/Thunks Dispatchados                                                    | Retorno                                                                 | i18n |
|---------------------------|--------------------|--------------------------------------------|-----------------------------|------------------------------------------------------------------------------|-------------------------------------------------------------------------|------|
| useDebounce               | Utility            | Debounce genérico de qualquer valor        | –                           | –                                                                            | Valor debouncido (T)                                                    | Não  |
| useProposalSearch         | Filter & Search    | Busca com debounce e filtro por status      | SigningProposalSlice        | fetchSigningProposals, setStatusFilter                                       | { statusFilter, inputValue, handleStatusChange, handleInputChange }     | Não  |
| useProposalPolling        | Data Sync          | Polling silencioso da lista de propostas    | SigningProposalSlice        | fetchSigningProposalsSilently                                                | – (efeito colateral)                                                    | Não  |
| useProposalDetail         | User Interaction   | Selecionar/abrir detalhes e notificar proposta | SigningProposalSlice        | setSelection, clearSelection, notifyProposal                                 | { handleRowClick, handleCloseModal }                                    | Não  |
| useProposalNotifications  | Side Effect        | Monitorar novas assinaturas e disparar toasts | UiSlice                     | addToast                                                                     | – (efeito colateral)                                                    | Sim  |
| useDossierLoader          | Data Loading       | Carregar e limpar estado do dossiê          | ESignDossierSlice           | fetchDossier, clearDossier                                                   | { dossier, loading, error, actionInProgress, disapprovalDraft }         | Não  |
| useDossierActions         | Business Logic     | Aprovar/reprovar dossiê, gerenciar modais   | ESignDossierSlice, UiSlice | approveDossier, disapproveDossier, addToast, setDisapprovalDraft (via modal) | { handleApprove, handleDisapprove, canAct, showConfirm, showReason, … } | Sim  |

---

## 🔍 Detalhamento por Hook

### useDebounce
- **Arquivo:** src/hooks/useDebounce.ts
- **Assinatura:** `useDebounce<T>(value: T, delay: number): T`
- **Responsabilidades:**
  - Retardar a propagação de alterações de um valor genérico.
  - Gerenciar timers e limpeza automática.
- **Funcionamento:**
  - Recebe um valor e um delay (ms).
  - Retorna o valor após o período de inatividade.
  - Limpa timeouts anteriores a cada mudança.
- **Redux Store:** Não interage.
- **Uso:** `useProposalSearch` o utiliza para debounce do termo de busca (300ms).
- **Exemplo:** `const debounced = useDebounce(input, 300);`

### useProposalSearch
- **Arquivo:** src/hooks/useProposalSearch.ts
- **Assinatura:** `useProposalSearch()`
- **Responsabilidades:**
  - Gerenciar o estado local do input de busca e do filtro de status.
  - Aplicar debounce (via useDebounce) ao termo de busca antes de disparar requisições.
  - Sincronizar os filtros com a Redux Store e disparar `fetchSigningProposals`.
- **Retorno:** `{ statusFilter, inputValue, handleStatusChange, handleInputChange }`
- **Redux Slice:** SigningProposalSlice
  - **Selectors:** `selectProposals` (para `statusFilter` e `searchTerm` iniciais).
  - **Actions:** `setStatusFilter(status)`, `fetchSigningProposals({ status, search })`.
- **Fluxo:**
  1. Usuário digita → `inputValue` atualiza imediatamente.
  2. Após 300ms de inatividade, `debouncedSearch` muda.
  3. Um `useEffect` dispara `fetchSigningProposals` com os filtros atuais.
- **Utilização:** Componente `FilterBar` (via `CorbanPannel`).

### useProposalPolling
- **Arquivo:** src/hooks/useProposalPolling.ts
- **Assinatura:** `useProposalPolling(interval = 30_000)`
- **Responsabilidades:**
  - Atualizar periodicamente a lista de propostas sem indicador de carregamento (polling silencioso).
- **Funcionamento:**
  - Ao montar, inicia `setInterval` que dispara `fetchSigningProposalsSilently`.
  - Ao desmontar, limpa o intervalo.
- **Redux Slice:** SigningProposalSlice
  - **Action:** `fetchSigningProposalsSilently()` (thunk que não altera `loading` nem `error`).
- **Utilização:** `CorbanPannel`.
- **Nota:** O intervalo padrão é 30 segundos (conforme implementação final), não 15.

### useProposalDetail
- **Arquivo:** src/hooks/useProposalDetail.ts
- **Assinatura:** `useProposalDetail()`
- **Responsabilidades:**
  - Gerenciar a seleção de uma proposta da lista (abertura de detalhes).
  - Disparar automaticamente a notificação (`notifyProposal`) quando uma proposta recém‑assinada é visualizada.
- **Retorno:** `{ handleRowClick, handleCloseModal }`
  - `handleRowClick(proposal)`: seleciona a proposta e, se aplicável, dispara `notifyProposal`.
  - `handleCloseModal()`: limpa a seleção (e notifica novamente, por segurança).
- **Redux Slice:** SigningProposalSlice
  - **Actions:** `setSelection`, `clearSelection`, `notifyProposal`.
  - **Selector:** `selectProposals` (para `selectedProposal`).
- **Memoização:** `useCallback` em ambos os handlers.
- **Utilização:** `CorbanPannel` repassa `handleRowClick` para as linhas da tabela e `handleCloseModal` para o painel de detalhes/modal.

### useProposalNotifications
- **Arquivo:** src/hooks/useProposalNotifications.ts
- **Assinatura:** `useProposalNotifications(items: SigningProposal[])`
- **Responsabilidades:**
  - Observar a lista de propostas e disparar um toast sempre que uma nova proposta assinada e notificável aparecer.
  - Evitar notificações duplicadas usando um `Set` estático (sobrevive a remontagens do componente).
- **Redux Slice:** UiSlice
  - **Action:** `addToast({ message, type })`.
- **Condições para notificação:**
  - `status === 'SIGNED'`
  - `notifiable === true`
  - `notified === false`
  - ID ainda não está no Set de notificados.
- **i18n:** Utiliza `messages.proposal.toast.newSignature` substituindo `{name}` e `{id}`.
- **Utilização:** `CorbanPannel`.

### useDossierLoader
- **Arquivo:** src/hooks/useDocierLoader.ts
- **Assinatura:** `useDossierLoader(id: string | undefined)`
- **Responsabilidades:**
  - Carregar o dossiê via API quando o componente monta ou o `id` muda.
  - Limpar o estado do slice ao desmontar.
  - Expor os estados de carregamento, erro, dados e `actionInProgress`.
- **Retorno:** `{ dossier, loading, error, actionInProgress, disapprovalDraft }`
- **Redux Slice:** ESignDossierSlice
  - **Selector:** `selectDossier` (retorna todo o estado).
  - **Actions:** `fetchDossier(id)`, `clearDossier()`.
- **Ciclo de vida:** `useEffect` com dependência `[id, dispatch]`.
- **Utilização:** `ESignDossierPanel`.

### useDossierActions
- **Arquivo:** src/hooks/useDocierActions.ts
- **Assinatura:** `useDossierActions(proposalId, status, actionInProgress)`
- **Responsabilidades:**
  - Executar as ações de aprovação e reprovação (com validação de permissão).
  - Gerenciar a visibilidade dos modais de confirmação (`showConfirm`, `showReason`).
  - Disparar toasts de feedback.
  - Calcular `canAct` (status pendente + sem ação em progresso).
- **Retorno:** `{ handleApprove, handleDisapprove, canAct, showConfirm, showReason, openApproveModal, closeApproveModal, openDisapproveModal, closeDisapproveModal }`
- **Redux Slices:**
  - ESignDossierSlice: `approveDossier`, `disapproveDossier`.
  - UiSlice: `addToast`.
- **Estado local:** `useState` para `showConfirm` e `showReason` (não foram para o slice, conforme decisão).
- **Memoização:** `handleApprove` e `handleDisapprove` usam `useCallback`.
- **Utilização:** `DecisionSection` (componente autônomo que não recebe props).
- **Observação:** A limpeza do rascunho (`disapprovalDraft`) é feita pelo `DisapprovalModal` ao enviar ou cancelar, via dispatch direto ao slice.
