# Documentação de Componentes React

Análise detalhada de todos os componentes React do projeto, incluindo
responsabilidades, conteúdo renderizado, relações com estado (Redux/Context)
e fluxos de dados. Baseado na implementação final das US-01 e US-02.

## 📊 Resumo Executivo de Componentes

| Categoria | Componente | Tipo | Estado | Responsabilidade |
|-----------|-----------|------|--------|-----------------|
| **Global** | Header | Presentacional | Router | Navegação entre US-01 e US-02 |
| **Global** | ToastContainer | Smart | Redux (UiSlice) + local | Exibição de notificações |
| **eSignProposal** | ProposalContent | Presentacional | Props | Renderização condicional de estados (loading/erro/vazio/lista) |
| **eSignProposal** | ProposalList | Presentacional | Props | Tabela de propostas |
| **eSignProposal** | ProposalRow | Presentacional | Props | Linha individual da tabela |
| **eSignProposal** | FilterBar | Presentacional | Props | Barra de busca e filtro |
| **eSignProposal** | StatusFilterSelect | Presentacional | Props | Select de status |
| **eSignProposal** | StatusBadge | Presentacional | Props | Badge colorido de status |
| **eSignProposal** | DetailsModal | Presentacional | Props | Modal de detalhes da proposta |
| **eSignProposal** | ContactAttemptList | Presentacional | Props | Lista de tentativas de contato |
| **eSignProposal** | ContactAttempt | Presentacional | Props | Item de tentativa de contato |
| **eSignProposal** | ProposalDetailsPanel | Presentacional | Props | Painel lateral de detalhes (desktop) |
| **eSignDossier** | DecisionSection | Smart | Redux (ESignDossierSlice) + hooks | Orquestra botões e modais de decisão |
| **eSignDossier** | ActionButtons | Presentacional | Props | Botões Aprovar/Reprovar |
| **eSignDossier** | ApprovalModal | Presentacional | Props | Modal de confirmação de aprovação |
| **eSignDossier** | DisapprovalModal | Smart | Redux (ESignDossierSlice) | Modal de motivo de reprovação |
| **eSignDossier** | DossierHeader | Presentacional | Props | Cabeçalho com número da proposta e status |
| **eSignDossier** | DossierStatusBadge | Presentacional | Props | Badge de status do dossiê |
| **eSignDossier** | SignatoryDataSection | Presentacional | Props | Dados completos do assinante |
| **eSignDossier** | PhotographicEvidenceSection | Presentacional | Props | Seção de evidências (selfie, documento, similaridade) |
| **eSignDossier** | SimilarityBar | Presentacional | Props | Barra de progresso da similaridade facial |
| **eSignDossier** | MapSection | Container (lazy + error boundary) | Props + Suspense | Seção de mapa com fallback |
| **eSignDossier** | DynamicMap | Presentacional (lazy) | Props | Mapa interativo Leaflet |
| **eSignDossier** | StaticMapFallback | Presentacional | Props | Fallback de mapa estático |
| **eSignDossier** | MapErrorBoundary | Error Boundary (class) | Local (hasError) | Captura erros do mapa e exibe fallback |
| **eSignDossier** | EvidenceLightbox | Smart | Local (open, index) | Galeria de imagens com zoom (lightbox) |

---

## 🌍 Componentes Globais

### Header
- **Tipo:** Presentacional / Layout
- **Responsabilidades:** Renderizar cabeçalho com logo e botão de navegação entre as duas user stories.
- **Estado:** Nenhum estado Redux. Utiliza `useLocation()` do React Router para saber qual rota está ativa.
- **Props:** Nenhuma.
- **Conteúdo Renderizado:** Logo da Neo Crédito (versão desktop e mobile), botão com seta que alterna entre `/us-01` (Painel CORBAN) e `/us-02/101` (atalho para um dossiê de exemplo). Textos via `messages.navigation`.
- **Responsividade:** Oculta/mostra elementos nos breakpoints `sm` e `md`.

### ToastContainer
- **Tipo:** Smart Component (Redux + Local State)
- **Responsabilidades:** Exibir fila de notificações (toasts) disparadas por qualquer parte da aplicação.
- **Estado:**
  - **Redux (UiSlice):** `selectToasts` (lista de toasts) e dispatch `removeToast`.
  - **Local State:** `exitingIds` (Set com IDs em processo de fade‑out).
- **Hooks:** `useAppDispatch`, `useAppSelector`, `useState`, `useCallback`, `useEffect`.
- **Fluxo:**
  1. Qualquer componente despacha `addToast({ message, type })`.
  2. O toast aparece no topo centralizado com animação `fade-in`.
  3. Após 5 segundos, ou ao clicar no ícone de fechar, inicia-se a animação `fade-out` e o toast é removido do estado após 400ms.
- **Acessibilidade:** `pointer-events-none` no container, `pointer-events-auto` nos itens.
- **Tipos de toast:** `success` (verde), `error` (vermelho), `info` (azul).

---

## 📋 Componentes eSignProposal (US-01 – Painel CORBAN)

### Hierarquia
```
CorbanPanel (page)
 ├── FilterBar
 │    └── StatusFilterSelect
 ├── ProposalContent
 │    └── ProposalList
 │         └── ProposalRow (xN)
 │              └── StatusBadge
 └── ProposalDetailsPanel (desktop)
 └── DetailsModal (mobile)
      ├── StatusBadge
      └── ContactAttemptList
           └── ContactAttempt
```

### ProposalContent
- **Tipo:** Presentacional
- **Props:** `loading: boolean`, `error: string | null`, `itens: SigningProposal[]`, `onRowClick: (proposal) => void`
- **Responsabilidades:** Renderizar o estado correto da lista: loading, erro, vazio ou a tabela (`ProposalList`).
- **Acessibilidade:** `role="status"`/`aria-live` para loading, `role="alert"` para erro, `aria-label` para estado vazio.
- **i18n:** Utiliza `messages.proposal.loading`, `messages.proposal.empty`, etc.

### ProposalList
- **Tipo:** Presentacional (tabela)
- **Props:** `itens: SigningProposal[]`, `onRowClick: (proposal) => void`
- **Conteúdo:** `<table>` com cabeçalho (ID, Cliente, Status, Último Evento) e mapeamento para `ProposalRow`.
- **i18n:** Cabeçalhos via `messages.proposal.table`.

### ProposalRow
- **Tipo:** Presentacional (linha da tabela)
- **Props:** `proposal: SigningProposal`, `onClick: (proposal) => void`, `index: number`
- **Lógica:** Determina se a proposta é "nova" (`notifiable && status === "SIGNED" && !notified`), exibindo um ícone ✔️ pulsante e o badge "Recém assinado".
- **Estilos:** Linhas alternadas (zebra), hover azul claro, cursor pointer.

### FilterBar
- **Tipo:** Presentacional
- **Props:** `statusFilter: ESignStatus | null`, `onStatusChange`, `inputValue: string`, `onInputChange`
- **Conteúdo:** `StatusFilterSelect` e `<input>` de busca.
- **i18n:** Placeholder via `messages.proposal.filter.searchPlaceholder`.

### StatusFilterSelect
- **Tipo:** Presentacional (select)
- **Props:** `value: ESignStatus | null`, `onChange: (status) => void`
- **Conteúdo:** Opções de status localizadas (`messages.status`).

### StatusBadge
- **Tipo:** Presentacional (badge)
- **Props:** `status: ESignStatus`, `pulse?: boolean` (default false)
- **Conteúdo:** Rótulo localizado. Se `pulse`, exibe "Recém Assinado" com animação `animate-pulse`. Mapeamento de cores por status.

### DetailsModal
- **Tipo:** Presentacional (modal)
- **Props:** `proposal: SigningProposal | null`, `loading: boolean`, `onClose: () => void`
- **Conteúdo:** Dados do cliente, link de assinatura, data de envio, tentativas de contato. Ícone X para fechar. Fundo escuro com `role="dialog"`.
- **Indicador de novo:** `isNew` derivado das props.

### ContactAttemptList / ContactAttempt
- **Tipos:** Presentacionais
- **Props:** `attempts: ContactAttempt[]` (lista) e `attempt: ContactAttempt` (item).
- **Conteúdo:** Item renderiza data formatada, meio de contato e observação. Uso de `<dl>` para semântica.

### ProposalDetailsPanel
- **Tipo:** Presentacional (painel lateral, visível em desktop)
- **Props:** `proposal: SigningProposal | null`, `loading: boolean`, `onClose: () => void`
- **Conteúdo:** Mesmo layout do `DetailsModal`, porém renderizado em um `<aside>` fixo na lateral direita. Estado vazio com mensagem instrucional.
- **i18n:** `messages.proposal.detailPanel.emptyTitle/emptyDescription`.

---

## 🎯 Componentes eSignDossier (US-02 – Painel de Validação)

### Hierarquia
```
ESignDossierPanel (page)
 ├── DossierHeader
 │    └── DossierStatusBadge
 ├── SignatoryDataSection
 ├── MapSection
 │    └── (Suspense + MapErrorBoundary)
 │         ├── DynamicMap (lazy)
 │         └── StaticMapFallback
 ├── PhotographicEvidenceSection
 │    ├── EvidenceLightbox
 │    └── SimilarityBar
 └── DecisionSection
      ├── ActionButtons
      ├── ApprovalModal (condicional)
      └── DisapprovalModal (condicional)
```

### DecisionSection
- **Tipo:** Smart Container (orquestrador)
- **Responsabilidades:** Obter o dossiê atual e as ações de decisão via hooks; gerenciar a visibilidade dos modais de confirmação e reprovação; coordenar o fluxo completo de aprovação/reprovação.
- **Estado:** Nenhum estado local próprio (toda lógica delegada ao hook `useDossierActions`). Conecta‑se ao Redux apenas através dos hooks.
- **Hooks utilizados:** `useParams` (obtém o ID da proposta), `useAppSelector(selectDossier)` (para `data` e `actionInProgress`), `useDossierActions` (retorna handlers, estado dos modais e `canAct`).
- **Props:** Nenhuma – componente autônomo.

### ActionButtons
- **Tipo:** Presentacional
- **Props:** `onApproveClick`, `onDisapproveClick`, `disabled`, `sticky?` (default true)
- **Conteúdo:** Pergunta "Aderente a política de validação?" e dois botões: "Aprovado: dentro da política" (verde) e "Reprovado: fora da política" (vermelho). Layout responsivo: sticky no rodapé em mobile, normal em desktop.
- **i18n:** `messages.dossier.decision.*`.

### ApprovalModal
- **Tipo:** Presentacional (modal)
- **Props:** `onConfirm`, `onCancel`
- **Conteúdo:** Título "Confirmar aprovação", mensagem explicativa, botões Cancelar/Confirmar.
- **i18n:** `messages.dossier.approvalModal.*`.

### DisapprovalModal
- **Tipo:** Smart Component (conectado ao Redux)
- **Props:** `onSubmit: (reason: string) => void`, `onCancel`
- **Responsabilidades:** Permitir que o operador digite o motivo da reprovação. O rascunho é mantido no estado `disapprovalDraft` do slice `ESignDossierSlice` (via dispatch `setDisapprovalDraft`).
- **Hooks Redux:** `useAppDispatch`, `useAppSelector(selectDossier)`.
- **Validação:** O botão "Reprovar" só habilita quando o texto não está vazio. Ao enviar ou cancelar, o rascunho é limpo.

### DossierHeader
- **Tipo:** Presentacional
- **Props:** `dossier: Dossier`
- **Conteúdo:** Nº da Proposta e badge de status do dossiê. Layout com borda esquerda azul.

### DossierStatusBadge
- **Tipo:** Presentacional
- **Props:** `status: DossierStatus`
- **Conteúdo:** Badge com cor conforme status (amarelo, verde, vermelho) e texto localizado (`messages.dossier.statusDossier`).

### SignatoryDataSection
- **Tipo:** Presentacional
- **Props:** `signatory: SignatoryData`, `formatDate?: (iso) => string` (opcional, default local)
- **Conteúdo:** Título "Dados do Assinante" seguido de nome, CPF, data da assinatura formatada, IP e endereço.

### PhotographicEvidenceSection
- **Tipo:** Presentacional (container)
- **Props:** `selfieUrl`, `documentUrl`, `facialSimilarity`
- **Conteúdo:** Título "Evidências Visuais", componente `EvidenceLightbox` com as duas imagens e `SimilarityBar` para a similaridade.

### SimilarityBar
- **Tipo:** Presentacional
- **Props:** `value: number` (0 a 100)
- **Conteúdo:** Barra de progresso horizontal colorida (verde ≥80%, amarelo ≥50%, vermelho <50%) e valor percentual ao lado.

### EvidenceLightbox
- **Tipo:** Smart Component (estado local)
- **Tecnologia:** `yet-another-react-lightbox` com plugin de zoom.
- **Props:** `images: { src, alt, label }[]`
- **Estado local:** `open: boolean`, `index: number` (qual imagem está ativa).
- **Conteúdo:** Miniaturas lado a lado. Ao clicar, abre o lightbox com zoom, pan e fechamento ao clicar no overlay ou pressionar ESC.

### MapSection
- **Tipo:** Container (lazy + error boundary)
- **Props:** `signatory: SignatoryData`
- **Conteúdo:** Título "Localização geográfica:", informações textuais de endereço (com separadores `|`), nota "Local aproximado da assinatura", e o mapa propriamente dito.
- **Técnicas:** `lazy()` para carregar `DynamicMap` sob demanda, `Suspense` com `fallback` (`StaticMapFallback`), e `MapErrorBoundary` para capturar erros.

### DynamicMap
- **Tipo:** Presentacional (lazy loaded)
- **Dependência:** `react-leaflet` + Leaflet.
- **Props:** `lat: number`, `lon: number`, `zoom?: number`
- **Conteúdo:** Mapa interativo com marcador na coordenada do assinante.

### StaticMapFallback
- **Tipo:** Presentacional
- **Props:** `lat`, `lon`, `zoom?`, `width?`, `height?`
- **Conteúdo:** Imagem estática de um tile do OpenStreetMap, com link para visualização interativa externa. Exibido enquanto o mapa dinâmico carrega ou em caso de erro.

### MapErrorBoundary
- **Tipo:** Error Boundary (classe React)
- **Props:** `fallback: ReactNode`, `children: ReactNode`
- **Estado local:** `hasError: boolean`
- **Funcionamento:** Captura erros de renderização dos filhos e exibe o `fallback` fornecido.

---

## 🔄 Matriz de Estado por Componente

| Componente | Local State | Redux Store | React Router | Hooks Customizados |
|-----------|------------|-------------|--------------|-------------------|
| Header | – | – | ✓ useLocation | – |
| ToastContainer | ✓ exitingIds | ✓ UiSlice | – | – |
| ProposalContent | – | – (recebe props) | – | – |
| ProposalList | – | – | – | – |
| ProposalRow | – | – | – | – |
| FilterBar | – | – | – | – |
| StatusFilterSelect | – | – | – | – |
| StatusBadge | – | – | – | – |
| DetailsModal | – | – (recebe props) | – | – |
| ContactAttemptList | – | – | – | – |
| ContactAttempt | – | – | – | – |
| ProposalDetailsPanel | – | – (recebe props) | – | – |
| DecisionSection | – | ✓ ESignDossierSlice | ✓ useParams | ✓ useDossierActions |
| ActionButtons | – | – | – | – |
| ApprovalModal | – | – | – | – |
| DisapprovalModal | – | ✓ ESignDossierSlice | – | – |
| DossierHeader | – | – | – | – |
| DossierStatusBadge | – | – | – | – |
| SignatoryDataSection | – | – | – | – |
| PhotographicEvidenceSection | – | – | – | – |
| SimilarityBar | – | – | – | – |
| EvidenceLightbox | ✓ (open, index) | – | – | – |
| MapSection | – | – (recebe props) | – | – |
| DynamicMap | – | – | – | – |
| StaticMapFallback | – | – | – | – |
| MapErrorBoundary | ✓ hasError | – | – | – |

---

## 🎨 Padrões de Design Utilizados

| Padrão | Exemplos |
|--------|----------|
| **Presentational vs Container** | A maioria dos componentes são presentacionais (recebem props). `DecisionSection` atua como container, orquestrando hooks e estado. |
| **Smart Components** | `ToastContainer`, `DisapprovalModal`, `EvidenceLightbox` utilizam estado local ou Redux para controlar seu comportamento. |
| **Lazy Loading & Suspense** | `DynamicMap` é carregado sob demanda com `lazy()`, e `Suspense` exibe `StaticMapFallback` durante o carregamento. |
| **Error Boundary** | `MapErrorBoundary` isola falhas do mapa, evitando que a página inteira quebre. |
| **Custom Hooks** | Lógica de busca, polling, notificações e ações de dossiê foi extraída para hooks, mantendo os componentes enxutos. |
| **Props Drilling Controlado** | `FilterBar` -> `StatusFilterSelect` é um exemplo de 2 níveis, aceitável. Casos mais complexos foram resolvidos com Redux ou hooks. |
| **i18n** | Todos os textos visíveis são obtidos do objeto `messages`, facilitando manutenção e futura tradução. |

---

## 📂 Estrutura de Pastas (Componentes)

```
src/components/
├── Header.tsx
├── ToastContainer.tsx
├── eSignProposal/
│   ├── ProposalContent.tsx
│   ├── ProposalList.tsx
│   ├── ProposalRow.tsx
│   ├── FilterBar.tsx
│   ├── StatusFilterSelect.tsx
│   ├── StatusBadge.tsx
│   ├── DetailsModal.tsx
│   ├── ContactAttemptList.tsx
│   ├── ContactAttempt.tsx
│   └── ProposalDetailsPanel.tsx
└── eSignDossier/
    ├── DecisionSection.tsx
    ├── ActionButtons.tsx
    ├── ApprovalModal.tsx
    ├── DisapprovalModal.tsx
    ├── DossierHeader.tsx
    ├── DossierStatusBadge.tsx
    ├── SignatoryDataSection.tsx
    ├── PhotographicEvidenceSection.tsx
    ├── SimilarityBar.tsx
    ├── EvidenceLightbox.tsx
    ├── MapSection.tsx
    ├── DynamicMap.tsx
    ├── StaticMapFallback.tsx
    └── MapErrorBoundary.tsx
```

---

Essa documentação reflete exatamente a estrutura atual do projeto, com cada componente mapeado em relação a seu estado, responsabilidades e conexões com a store Redux.
