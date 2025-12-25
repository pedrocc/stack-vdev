# Stack VDev

Template de monorepo **TypeScript + Bun** para aplicações web modernas com API REST e SPA.

## Tech Stack

| Camada | Tecnologia |
|--------|------------|
| **Runtime** | [Bun](https://bun.sh) |
| **API** | [Hono](https://hono.dev) |
| **Frontend** | [React 19](https://react.dev) + [Wouter](https://github.com/molefrog/wouter) + [SWR](https://swr.vercel.app) |
| **UI** | [shadcn/ui](https://ui.shadcn.com) + [Tailwind CSS 4](https://tailwindcss.com) |
| **Database** | [PostgreSQL](https://postgresql.org) + [Drizzle ORM](https://orm.drizzle.team) |
| **Cache/Queue** | [Redis](https://redis.io) + [BullMQ](https://bullmq.io) |
| **Auth** | [Clerk](https://clerk.com) |
| **Email** | [Resend](https://resend.com) |
| **Validação** | [Zod](https://zod.dev) |
| **Linting** | [Biome](https://biomejs.dev) |

## Estrutura do Projeto

```
stack-vdev/
├── apps/
│   ├── api/              # Hono REST API
│   │   ├── src/
│   │   │   ├── routes/   # Endpoints por domínio
│   │   │   ├── middleware/  # Auth, rate-limit, error handling
│   │   │   └── lib/      # Utilitários da API
│   │   └── Dockerfile
│   └── web/              # React SPA
│       ├── src/
│       │   ├── pages/    # Páginas da aplicação
│       │   ├── components/  # Componentes React
│       │   └── lib/      # API client, utils
│       └── Dockerfile
├── packages/
│   ├── shared/           # Schemas Zod, tipos, constantes
│   ├── db/               # Drizzle ORM + migrations
│   ├── ui/               # Componentes shadcn/ui
│   ├── jobs/             # BullMQ queues/workers
│   └── email/            # Templates de email (Resend)
├── tooling/
│   ├── typescript/       # Configs TypeScript compartilhadas
│   └── biome/            # Config Biome
├── docker/               # Docker Compose (PostgreSQL + Redis)
├── scripts/              # Scripts de desenvolvimento
└── .github/workflows/    # CI/CD (GitHub Actions)
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

# 4. Rodar migrations e seeds
bun db:migrate
bun db:seed

# 5. Iniciar desenvolvimento
bun dev
```

**URLs de desenvolvimento:**
- API: `http://localhost:3000`
- Web: `http://localhost:5173`

## Comandos

| Comando | Descrição |
|---------|-----------|
| `bun dev` | Inicia API + Web em modo desenvolvimento |
| `bun build` | Build de produção |
| `bun test` | Executa todos os testes |
| `bun test --coverage` | Testes com cobertura |
| `bun lint` | Verifica lint com Biome |
| `bun lint:fix` | Corrige problemas de lint automaticamente |
| `bun format` | Formata código com Biome |
| `bun typecheck` | Verifica tipos TypeScript |
| `bun db:migrate` | Aplica migrations do banco |
| `bun db:seed` | Popula banco com dados de teste |
| `bun db:studio` | Abre Drizzle Studio (GUI) |
| `bun verify-clerk` | Valida configuração do Clerk |
| `bun health-check` | Verifica status dos serviços |

## Funcionalidades

### API (`apps/api`)

- **Autenticação**: JWT via Clerk com middleware dedicado
- **Rate Limiting**: 100 req/min (anônimo), 1000 req/min (autenticado)
- **Roles**: Suporte a admin com `requireAdmin` middleware
- **Respostas padronizadas**: Formato consistente com `success/error`
- **Health check**: Endpoint `/health` para monitoramento
- **Security headers**: Configurados via Hono middleware

### Web (`apps/web`)

- **Rotas protegidas**: Dashboard requer autenticação
- **API Client tipado**: Integração com SWR para data fetching
- **Error Boundary**: Tratamento global de erros
- **Componentes shadcn/ui**: Tema Red, modo Light

### Packages

| Package | Descrição |
|---------|-----------|
| `@repo/shared` | Schemas Zod, tipos compartilhados, constantes |
| `@repo/db` | Cliente Drizzle, schemas, migrations |
| `@repo/ui` | Componentes React (shadcn/ui) |
| `@repo/jobs` | Filas BullMQ (email, sync) |
| `@repo/email` | Cliente Resend + templates |

## Variáveis de Ambiente

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

# Opcional
SENTRY_DSN=https://...
```

## Configuração do Clerk

1. Crie uma conta em [clerk.com](https://clerk.com)
2. Crie um novo application
3. Configure Microsoft Entra ID (opcional)
4. Copie as chaves para o `.env`
5. Execute `bun verify-clerk` para validar

## Deploy

O projeto está configurado para deploy via **Railway** com GitHub Actions:

- Push para `main` → deploy automático
- Dockerfiles otimizados com multi-stage build
- Base image: `oven/bun:1-alpine`
- Web servida via Nginx

### CI/CD Pipeline

1. **Lint** - Biome check
2. **Type Check** - TypeScript validation
3. **Test** - Testes com PostgreSQL + Redis
4. **Build** - Build de produção
5. **Deploy** - Railway (apenas `main`)

## Criando um Novo Projeto

Este repositório é um template. Para criar um novo projeto:

```bash
# 1. Clone o template
git clone https://github.com/seu-usuario/stack-vdev.git meu-projeto
cd meu-projeto

# 2. Inicialize o projeto com seu nome
bun new-project --name=meu-projeto --description="Descrição do projeto"
```

### O que o script `new-project` faz

O script automaticamente renomeia o projeto em todos os arquivos relevantes:

| Arquivo | Alteração |
|---------|-----------|
| `package.json` | Nome do workspace |
| `docker/docker-compose.yml` | Containers e banco de dados |
| `.env.example` | DATABASE_URL |
| `apps/web/index.html` | Título da página |
| `apps/web/src/pages/Home.tsx` | Texto de boas-vindas |
| `apps/web/src/components/Layout.tsx` | Header |
| `packages/email/src/templates/welcome.ts` | Templates de email |

### Conversão automática de nomes

O script converte o nome para os formatos necessários:

| Input | Formato | Uso |
|-------|---------|-----|
| `meu-projeto` | kebab-case | package.json |
| `meu_projeto` | snake_case | docker, database |
| `Meu Projeto` | Title Case | UI, emails |

### Outras ações do script

- Remove o histórico git do template
- Inicializa um novo repositório git
- Copia `.env.example` para `.env`
- Instala todas as dependências

**Requisitos do nome:** deve ser kebab-case (letras minúsculas, números e hífens, começando com letra).

Após a inicialização, configure suas variáveis de ambiente no `.env` e siga o Quick Start.

## Licença

MIT
