# Registro de Decisões e Processo de Desenvolvimento

> Relatório de decisões de arquitetura, ferramentas e qualidade adotadas durante o desenvolvimento do teste prático.  
> Cada escolha foi orientada pelos critérios de avaliação, simplicidade e alinhamento com as "dores" descritas nas user stories.

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

### 1.2. O que ficará de fora

Seguindo o pressuposto de não adicionar itens não avaliados:
- Não haverá deploy. Por isso não haverão rotinas de CD apesar de rotinas CI estarem presentes.
- Por não haver deploy também não haverão branches além da Main.
- Não adicionarei traduções ou estilização complexa.
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

### 2.6. 9º Commit

Desenho de diagramas para a modelagem da tipagem de entidades e enums priorizando design escalável a partir do levantamento de variáveis, separação de responsabilidades e intersecção das user stories. Desenho de driagramas para a modelagem da tipagem dos estados client com Redux store e Slices.

A abstração da entidade Pessoa não trará diferenças na implementação das user stories já que cada uma das telas possui objetivos de demonstração bem concisos mas demonstra o uso de tipagem avançada, um dos critérios de avaliação.