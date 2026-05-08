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
- Não haverá deploy.
- Não adicionarei traduções ou estilização complexa.
- Sem persistencia de dados.

---

## 2. Registro de pensamentos e progresso de commits

Os commits serão registrados seguindo a convenção em inglês.

## 2.1. Primeiro Commit

Estruturação do projeto com scaffolding do Vite, instalação e configuração do Tailwind, exclusão de boilerplate desnecessária, começo da estruturação do processo e ambiente de desenvolvimento definindo padrões de projeto e automatização de rotinas e scripts para a manutenção da qualidade de código com formatação, linting e checagem da tipagem incluindo regras de formatação para diferentes IDEs com .editorconfig.