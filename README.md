# Stack VDev

Template de monorepo TypeScript + Bun para aplicações web modernas.

## Tech Stack

- **Runtime/Bundler/Package Manager**: [Bun](https://bun.sh)
- **API**: [Hono](https://hono.dev) - Framework web ultrarrápido
- **Frontend**: [React 19](https://react.dev) + [Wouter](https://github.com/molefrog/wouter) + [SWR](https://swr.vercel.app)
- **Database**: [PostgreSQL](https://postgresql.org) + [Drizzle ORM](https://orm.drizzle.team)
- **Cache/Queue**: [Redis](https://redis.io) + [BullMQ](https://bullmq.io)
- **Auth**: [Clerk](https://clerk.com)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **Linting**: [Biome](https://biomejs.dev)

## Estrutura

```
stack_vdev/
├── apps/
│   ├── api/          # Hono REST API
│   └── web/          # React SPA
├── packages/
│   ├── shared/       # Schemas, tipos, utilitários
│   ├── db/           # Drizzle ORM + migrations
│   ├── ui/           # Componentes React
│   ├── jobs/         # BullMQ queues/workers
│   └── email/        # Templates de email (Resend)
├── tooling/
│   ├── typescript/   # Configs TypeScript
│   └── biome/        # Config Biome
├── scripts/          # Scripts de desenvolvimento
└── docker/           # Docker Compose
```

## Requisitos

- [Bun](https://bun.sh) >= 1.0
- [Docker](https://docker.com) (para PostgreSQL e Redis)

## Quick Start

```bash
# 1. Instalar dependências
bun install

# 2. Iniciar containers (PostgreSQL + Redis)
docker compose -f docker/docker-compose.yml up -d

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com suas chaves (Clerk, Resend, etc.)

# 4. Rodar migrations
bun db:migrate

# 5. Iniciar desenvolvimento
bun dev
```

A API estará em `http://localhost:3000` e o frontend em `http://localhost:5173`.

## Comandos

| Comando | Descrição |
|---------|-----------|
| `bun dev` | Inicia API + Web em modo desenvolvimento |
| `bun test` | Executa todos os testes |
| `bun build` | Build de produção |
| `bun lint` | Verifica lint com Biome |
| `bun typecheck` | Verifica tipos TypeScript |
| `bun db:migrate` | Aplica migrations |
| `bun db:seed` | Popula banco com dados de teste |
| `bun db:studio` | Abre Drizzle Studio |
| `bun verify-clerk` | Valida configuração do Clerk |
| `bun health-check` | Verifica status dos serviços |

## Configuração

### Variáveis de Ambiente

```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/stack_vdev

# Redis
REDIS_URL=redis://localhost:6379

# Auth (Clerk)
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Email (Resend)
RESEND_API_KEY=re_...

# URLs
API_URL=http://localhost:3000
WEB_URL=http://localhost:5173
```

### Clerk

1. Crie uma conta em [clerk.com](https://clerk.com)
2. Crie um novo application
3. Copie as chaves de API Keys para o `.env`
4. Execute `bun verify-clerk` para validar

## Testes

```bash
# Todos os testes
bun test

# Com coverage
bun test --coverage

# Arquivo específico
bun test apps/api/src/middleware/auth.test.ts
```

## Deploy

O projeto está configurado para deploy via Railway com GitHub Actions:

- Push para `main` = deploy automático
- Dockerfiles otimizados em `apps/api/Dockerfile` e `apps/web/Dockerfile`

## Licença

MIT
