# Documentação de CI/CD, Qualidade de Código e Rotinas DX

Pipeline de integração contínua, ferramentas de qualidade, automação local
e scripts de desenvolvimento configurados no projeto.

## 🚀 Pipeline CI/CD (GitHub Actions)

**Arquivo:** `.github/workflows/ci.yml`
**Triggers:** push e pull_request na branch `main`
**Ambiente:** ubuntu-latest, Node 24, npm com cache

Quatro jobs executam em paralelo. Todos precisam passar para o merge ser permitido.

| Job | Script | O que verifica |
|-----|--------|---------------|
| 🔍 Lint | `npm run lint` | ESLint + Prettier |
| 🔎 Type Check | `npm run type-check` | TypeScript (`tsc --noEmit`) |
| 🧪 Tests | `npx vitest run` | Vitest com jsdom |
| 🏗️ Build | `npm run build` | `tsc -b && vite build` |

Cada job executa: checkout → setup-node (com cache) → `npm ci` → script específico.

---

## 🧰 Ferramentas de Qualidade de Código

### ESLint (`eslint.config.js`)
- **Formato:** Flat config (ESLint 9+)
- **Extends:** `js.configs.recommended`, `tseslint.configs.recommended`
- **Plugins:** `react-hooks`, `react-refresh`, `prettier`, `import-x`
- **Regras principais:**
  - `prettier/prettier`: erro (código fora do padrão Prettier bloqueia)
  - `import-x/order`: erro (organiza imports automaticamente em grupos: builtin → external → internal → parent → sibling → index)
  - `@typescript-eslint/no-unused-vars`: erro (exceto variáveis com prefixo `_`)
  - `react-hooks/rules-of-hooks`: erro

### Prettier (`.prettierrc`)
- `printWidth`: 80
- `semi`: true
- `singleQuote`: false
- `trailingComma`: "es5"

### TypeScript (`tsconfig.json`)
- `strict`: true
- `noUnusedLocals`: true
- `noUnusedParameters`: true
- `noFallthroughCasesInSwitch`: true
- `moduleResolution`: "bundler"
- `jsx`: "react-jsx"
- `baseUrl`: "." com paths `@/*` → `src/*`

### Vitest (`vitest.config.ts`)
- `globals`: true (dispensa import de describe/it/expect)
- `environment`: "jsdom"
- `setupFiles`: `./src/test/setup.ts` (inicia MSW e matchers do Testing Library)
- `coverage.provider`: "v8" (relatórios text, html, lcov)
- Exclui da cobertura: `main.tsx`, `vite-env.d.ts`, handlers, arquivos de setup e de teste

---

## 🪝 Pre-commit Hooks (Husky + lint-staged)

**Arquivo:** `.husky/pre-commit`

Ao executar `git commit`, o Husky dispara o script que roda:
1. `npx lint-staged` – aplica ESLint (com fix) e Prettier apenas nos arquivos staged.
2. `npm run type-check` – verifica tipagem TypeScript.
3. `npm run test` – executa a suite de testes.
4. `npm run build` – garante que a build de produção funciona.

Se qualquer etapa falhar, o commit é bloqueado até que os problemas sejam corrigidos.

**lint-staged** está configurado para:
- `*.{ts,tsx}`: `eslint --fix` + `prettier --write`
- `*.{json,css}`: `prettier --write`

O setup do Husky é automático via script `"prepare": "husky"` no `package.json`.

---

## 📦 Scripts NPM Principais

| Script | Comando | Uso |
|--------|---------|-----|
| `dev` | `vite` | Servidor de desenvolvimento com HMR |
| `build` | `tsc -b && vite build` | Build de produção |
| `lint` | `eslint .` | Verificar linting |
| `format` | `prettier --write "src/**/*.{ts,tsx,css,json}"` | Formatar código |
| `type-check` | `tsc --noEmit` | Verificar tipos TypeScript |
| `test` | `vitest run` | Executar testes (modo CI) |
| `test:watch` | `vitest` | Executar testes em modo watch |
| `test:coverage` | `vitest run --coverage` | Testes com relatório de cobertura |
| `preview` | `vite preview` | Preview local da build de produção |

---

## 🔄 Fluxo de Desenvolvimento Diário

**Iniciar:**
```bash
git pull origin main
npm install
npm run dev        # Servidor em http://localhost:5173
npm run test:watch # Testes em watch (terminal separado)
```

**Antes de commitar:**
```bash
npm run format
npm run lint
npm run type-check
npm test
npm run build
git add .
git commit -m "feat: descrição"   # Husky roda as verificações automaticamente
```

**Push e CI:**
Após o push, o GitHub Actions executa os 4 jobs em paralelo. Se todos passarem, o merge é permitido.

---

## 📁 Arquivos Relevantes

- `.github/workflows/ci.yml` – Pipeline CI/CD
- `eslint.config.js` – Configuração ESLint (flat config)
- `.prettierrc` – Configuração Prettier
- `tsconfig.json` – Configuração TypeScript
- `vitest.config.ts` – Configuração Vitest
- `.husky/pre-commit` – Script de pre-commit
- `package.json` – Scripts e dependências
