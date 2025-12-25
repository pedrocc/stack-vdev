# Instruções para Claude Code

## Regra #1: Bun Obrigatório
Este projeto usa **exclusivamente Bun** para:
- **Runtime**: `bun run src/index.ts`
- **Package Manager**: `bun install`, `bun add`
- **Bundler**: `bun build`
- **Test Runner**: `bun test`

**PROIBIDO:** Node.js, npm, yarn, pnpm, Vite, esbuild, Webpack, Jest, Vitest.

## Sobre este Projeto
Template de monorepo TypeScript + Bun para aplicações web (API REST + SPA).

## Comandos Principais
```bash
bun dev          # Inicia API + Web em modo desenvolvimento
bun test         # Roda todos os testes (via Bun)
bun build        # Build de produção (via Bun bundler)
bun lint         # Lint + format check (via Biome)
bun db:migrate   # Aplica migrations
bun db:seed      # Popula banco com dados de teste
bun typecheck    # Verifica tipos TypeScript
```

## Estrutura
- `apps/api` — Hono REST API (executado com `bun run`)
- `apps/web` — React SPA (bundled com Bun)
- `packages/*` — Código compartilhado

## Autenticação (Clerk)
- Frontend: usar `<ClerkProvider>`, `<SignIn>`, `<SignUp>`, `<UserButton>`
- Backend: verificar JWT com `@clerk/backend` ou middleware Hono
- Não implementar auth customizado — Clerk gerencia tudo
- Microsoft Entra ID configurado no dashboard Clerk

## Regras de Código
1. TypeScript strict — nunca use `any`
2. Valide inputs com Zod
3. Escreva testes com `bun test` para lógica de negócio
4. Use exclusivamente componentes **shadcn/ui** (tema Red, modo Light)
5. Schemas compartilhados ficam em `@repo/shared`

## Padrões de API
- Rotas em `apps/api/src/routes/{domínio}.ts`
- Use OpenAPI decorators do Hono
- Rate limiting já configurado globalmente
- Auth via middleware Clerk (`clerkMiddleware`)

## Padrões de Frontend
- Pages em `apps/web/src/pages/`
- Rotas definidas em `apps/web/src/router.tsx`
- Data fetching com SWR + API client tipado
- Build com `bun build` (NÃO Vite)
- Auth UI do Clerk (não criar formulários de login)

### Componentes UI (shadcn/ui)
**OBRIGATÓRIO:** Use exclusivamente componentes do **shadcn/ui** para toda a interface.

**Configuração:**
- **Tema:** Red (vermelho como cor primária)
- **Modo:** Light (modo claro)
- **Localização:** Componentes em `packages/ui` ou `@repo/ui`

**Como usar:**
- Sempre prefira componentes shadcn/ui ao criar UI
- Não criar componentes customizados se shadcn já fornece
- Manter consistência com o tema Red
- Todos os componentes devem respeitar o modo Light

**Componentes disponíveis (shadcn/ui):**
- Button, Input, Card, Dialog, Dropdown, Select
- Tabs, Accordion, Tooltip, Popover, Toast
- Form, Label, Checkbox, Radio, Switch
- Alert, Badge, Avatar, Separator
- E outros do shadcn/ui

**Instalação de novos componentes shadcn:**
```bash
# Adicionar componente shadcn
bunx shadcn@latest add [component-name]
```

## Design de Interface

**IMPORTANTE:** Sempre que for criar ou modificar componentes visuais, páginas, ou qualquer elemento de UI, você DEVE usar a skill `frontend-design`.

### Quando usar frontend-design:
- Criar novos componentes React
- Criar novas páginas
- Redesenhar componentes existentes
- Implementar layouts
- Estilizar elementos com Tailwind CSS
- Criar interfaces interativas
- Trabalhar em qualquer aspecto visual da aplicação

### Como usar:
Use a função Skill com o parâmetro `skill: "frontend-design"` ANTES de implementar qualquer componente visual.

**LEMBRE-SE:** Sempre usar componentes **shadcn/ui** (tema Red, modo Light) ao implementar a UI.

### Exemplos:
```typescript
// ✅ CORRETO - Usar skill + shadcn/ui
Skill({ skill: "frontend-design", args: "criar modal de confirmação com shadcn Dialog" })

// ❌ ERRADO - Criar componente diretamente sem skill
// Não fazer isso para trabalhos de UI/design
```

### Por que usar:
- Garante qualidade visual profissional
- Evita designs genéricos ou sem identidade
- Mantém consistência com o design system (shadcn/ui tema Red)
- Produz código otimizado e bem estruturado
- Respeita o modo Light e paleta vermelha do projeto

## Antes de Implementar
1. Consulte docs via Context7 para a tecnologia em questão
2. Verifique se já existe código similar no projeto
3. Siga os padrões existentes
4. Confirme que está usando Bun (não Node/npm/Vite)

## Adicionar Dependências
```bash
# Correto
bun add pacote
bun add -d pacote-dev

# ERRADO - nunca usar
npm install pacote
yarn add pacote
```

## Testes
```bash
# Rodar todos
bun test

# Rodar específico
bun test apps/api/src/services/user.test.ts

# Com coverage
bun test --coverage
```

## Deploy
Railway via GitHub Actions. Push para `main` = deploy automático.
Dockerfiles usam `oven/bun:1-alpine` como base.
