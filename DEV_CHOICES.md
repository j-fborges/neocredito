# Registro de Decisões e Processo de Desenvolvimento

> Relatório de decisões de arquitetura, ferramentas e qualidade adotadas durante o desenvolvimento do teste prático.
> Cada escolha foi orientada pelos critérios de avaliação, simplicidade e alinhamento com as "dores" descritas nas user stories.

> [!NOTE]
> Para o desenvolvimento utilizarei inglês, mas estou usando português para os diagramas em `./docs/diagrams/` e na documentação como uma forma de elaborar conceitualmente sobre a estrutura do projeto utilizando a mesma linguagem do enunciado do desafio. Da mesma forma existem campos listados nos diagramas que por motivos que listei adiante não foram incluídos no código.
>
> Optei por utilizar inglês como base do desenvolvimento seguindo o padrão da industria e facilitando a aderência a convenções de arquitetura e boas práticas.
>


---

## 1. Pre‑setup do projeto

### 1.1. Decisões sobre arquitetura e estrutura

Tratando‑se de um teste prático, optei por uma solução **sucinta e aderente aos pontos avaliados**, sem adicionar complexidade desnecessária.

As telas correspondem a um **módulo interno de gestão de assinaturas eletrônicas**, com características claras:
- Informações objetivas e uso administrativo (não há necessidade de SEO ou indexação).
- Volume de dados baixo, informação de tela sucinta e fluxos orientados a painéis de controle.
- Contexto isolado, que poderia evoluir para um microfrontend.

Por isso:
- **SPA React com Vite** (e não Next.js) foi a escolha, aderindo a um roteamento simples e sem SSR, para um UX mais flúido com pré-carregamento das interfaces no browser e redução de carga no servidor.
- **React Router** para navegação simples.
- **Redux Toolkit** para gerenciamento de estado: modelos estruturados para chamadas assíncronas tipadas e slices independentes (propostas e dossiê), mantendo o código organizado e alinhado com o perfil de painel e a separação de responsabilidades.
- **Tailwind CSS** para estilização: equilíbrio entre produtividade e controle fino, sem a necessidade da complexidade e estruturação que um design system específico demandaria (conforme excluído da avaliação) e priorizando uma estilização fluida in‑line.
- **Flowbite React** como kit de UI: componentes prontos estilizados com Tailwind e focados em dashboards para acelerar o desenvolvimento.
- **MSW (Mock Service Worker)** para simular a API: interceptação realista no nível de rede, reutilização nos testes e possível substituição futura por endpoints reais sem alterar a lógica da aplicação.

---

### 1.2. O que ficará de fora ( ou "O que eu faria diferente se não fosse um teste")

Seguindo o pressuposto de não adicionar itens não avaliados:
- Normalmente (em projetos que sou responsável pela modelagem de entidades), eu definiria um campo `id` para todo objeto de domínio próprio. Mas, como não foi incluso nos campos para dos objetos descritos no teste, e tratando-se de um teste de front-end, não incluirei esse campo.
- Não haverá deploy. Por isso não haverão rotinas de CD apesar de rotinas CI estarem presentes.
- Não adicionarei taxa mínima de cobertura de testes nem para Husky nem para CI.
- Por não haver deploy também não haverão branches além da Main.
- Não adicionarei internacionalização (i18n) ou estilização complexa, pois não faz sentido.
- Sem persistencia de dados.

---

## 2. Registro de pensamentos e progresso de commits

Os commits serão registrados seguindo a convenção em inglês.

A sequência a seguir apresenta pulos pois descreve os commits mais relevantes para o registro de pensamentos e progresso de desenvolvimento e exclui commits baseados em correções e formatações.

### 2.1. Primeiro Commit

Estruturação do projeto com scaffolding do Vite, instalação e configuração do Tailwind, exclusão de boilerplate desnecessária, começo da estruturação do processo e ambiente de desenvolvimento definindo padrões de projeto e automatização de rotinas e scripts para a manutenção da qualidade de código com formatação, linting e checagem da tipagem incluindo regras padronização da formatação para diferentes IDEs com .editorconfig.

### 2.2. 2º Commit

Instalação e configuração do Redux Toolkit utilizando sua convenção oficial para tipagem global dinâmica. Separação de hooks de store dentro de "./src/store" para melhor legibilidade. Adicionado script para linting com correções automatizadas.

### 2.3. 3º Commit

Instalação do MSW (para mockagem da API) e estruturação das pastas. Declaração do enableMocking() no main.tsx com funcionalidade e importação ocorrendo apenas no ambiente de desenvolvimento (evitando o uso de eventuais pastas/arquivos adicionais entrarem em um eventual bundle de produção). Como se trata de uma aplicação enxuta para um teste que não envolverá mais funções de startup, também optei por não separar a lógica de inicialização do arquivo ./src/main.tsx .

### 2.4. 4º Commit

Instalação e configuração da estrutura de testes unitários com Vitest e React Testing Library + Matchers do Jest. Instalação e configuração do Husky e lint-staged + rotinas de CI. Com isso criamos um fluxo de desenvolvimento e checagens automatizadas para qualidade de código pre commit e no repositório do github a cada push.

### 2.5. 5º a 8º Commit

Desenho de diagramas (em notação `Mermaid`) de relações entre Atores, Ações e Eventos para cada User Story de forma a embasar o desenho de wireframes.

Os diagramas envolvem todo o fluxo de uso de cada uma das telas (Painel de Validação do Dossiê de Assinatura e Painel de Acompanhamento do CORBAN) incluindo o levantamento de possíveis ações prévias e seguintes aos User Stories US-01 e US-02 para melhor visualização das necessidades de desenvolvimento, incluindo os modelos de entidades para a tipagem de objetos.

### 2.6. 9º a 10º Commit

Desenho de diagramas para a modelagem da tipagem de objetos, instancias e enums priorizando design escalável a partir do levantamento de variáveis, separação de responsabilidades e intersecção das user stories. Desenho de driagramas para a tipagem dos estados client com Redux store e Slices.

A entidade "Cliente" (no código, instância de tipagem `Customer`) aparece na descrição do desafio de forma superficial e em ambas User Stories apenas existe como informação acessória dos domínios "Proposta" e "Dossiê" — essas duas últimas poderiam apenas estender "Cliente". Preferi fazer uma relação de composição entre os tipos, porque acredito que descrevem melhor a relação entre cada objeto e resulta em uma estrutura escalável.

### 2.7. 11º Commit

Criado as tipagens globais para a User Story US-01. Criado e testado os handlers para a API mockada do MWS com 13 registros de Propostas de Assinatura. Adicionado relatorios automatizados de coberturas de teste para o Vitest.

OBS: O padrão `as const` usado nos tipos de `./src/types/signingProposal.ts` é preferível a um simples `type` ou `enum` porque centraliza tipo e valor de execução em uma única fonte de verdade (ex: `ESignStatus` é o tipo usado na checagem de valores e `ESIGN_STATUS` é utilizado para a indexação desses valores), eliminando duplicação e o risco de inconsistências futuras. Diferentemente do `enum`, não gera código JavaScript extra (na transpilação) nem enfrenta problemas de interoperabilidade com bundlers modernos mantendo a manutenibilidade sem custo real de runtime. O padrão também segue a natureza **estrutural** da linguagem Typescript evitando as suas exceções de recursos nominais como o `enum` (que tem seu uso desencorajado pela comunidade do Typescript moderno hoje)

### 2.8. 12º Commit

Estruturação do Slice `SigningProposalSlice.ts` para a User Story `US-01` com **Thunks Assíncronos** para as chamadas da API mockada. Usarei uma lista simples de Propostas de Assinatura com objetos contendo todas as informações necessarias para a tela. Manterei salvos no estado do **Redux Store** as `searchTerm` e `statusFilter` em nome da usabilidade, levando em consideração que é uma tela de trabalho. (Por ser uma SPA o estado ficará salvo) Contudo, as chamadas para a API mockada serão feitas com valores de estado gerenciado pelo Context de cada componente. (Isso simplifica a usabilidade enquanto os estados do Redux Store servirão como valores iniciais pros estados Context dos componentes). Testagem do Slice.

OBS: Optei por repetir a chamada `fetchSigningProposals` em mudanças de filtro e busca, ao invés de filtrar uma lista previamente carregada, pois isso manteria a tela atualizada automaticamente com informações do backend em jornadas mais longas de uso. Como o volume de informação é enxuto, para uso interno, e podendo recorrer a paginação, essa abordagem não sobrecarregaria a API.

### 2.9. 14º Commit

Configuração de roteamento e primeiras rotas com `react-router-dom`, páginas e componentes da User Story `US-01`.

Como o enunciado do desafio foca nas User Stories fazendo um <u>recorte de fluxo e usabilidade</u> farei apenas duas rotas `/us-01` e `/us-02`.  a **rota raiz** `/` redicionará para `/us-01` enquanto outras rotas inexistentes mostrarão uma mensagem simples de página não encontrada.

Configuração de assets (fontes e ícones) e tokens Tailwind (cores e fontes) para estilização **<u>apenas baseada</u>** na identidade gráfica da home `https://neocredito.com.br/`.

Atualização de testes unitários para `./src/App.tsx` includindo testes para conteúdo e rotas.

Separação de responsabilidades: Nesse momento `./src/main.tsx` contem a configuração de **provedores globais (Redux e Router)** enquanto em `./src/App.tsx` é definido **rotas, layout e componentes**. (Facilitando testagem e manutenção)

### 2.10. 16º Commit

Primeira iteração de componentes da página do `Painel de Acompanhamento do CORBAN` (US-01) incluindo listagem e filtros de busca integrados com o Redux Slice correspondente. Criação de hook `useDebounce.ts` para diminuir o volume de requisições desnecessárias para a API mockada enquanto o usuário digita sua busca por `Nome de Cliente` ou `Número da Proposta`. A componentização foi estruturada a partir a separação de responsabilidades: `CorbanPannel.tsx` orquestra mudanças de estado, `ProposalContent.tsx` lida com condicionais de *erro* e *loading* , `ProposalList.tsx` itera sobre registros (e no futuro pagina), `ProposalRow.tsx` renderiza informações e lida com eventos de clique (seleção de Proposta), `StatusBadge.tsx` lida com a lógica dos ícones sinalização de status da proposta.

Testagem unitária de componentes a partir do `./src/pages/CorbanPannel.tsx`.

### 2.11. 17º Commit

Adicionado Modal de Detalhes das Propostas de Assinatura, com informações sobre os clientes, datas, link de assinatura e lista de tentativas de contato. Refatoração de `FilterBar.tsx` e desacoplamento (componentização) de `StatusFilterSelect.tsx`.
