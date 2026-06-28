```
  ⚡
  ███████ ███████ ███████ ███████ ███████ ███████ ███████ ███████████
 ░███░░░ ░███░░░ ░███░░░ ░███░░░ ░███░░░ ░███░░░ ░███░░░ ░░░░░███░░░░
 ░███    ░███    ░███    ░███    ░███    ░███    ░███        ░███
 ░███████░██████ ░███████░███████░███████░███████░███████    ░███
 ░███░░░ ░███░░░ ░███░░░ ░███░░░ ░███░░░ ░███░░░ ░███░░░     ░███
 ░███    ░███    ░███    ░███    ░███    ░███    ░███        ░███
 ░███████░██████ ███████░███████░███    ░███    ░██████     ░███
 ░░░░░░░ ░░░░░░ ░░░░░░░ ░░░░░░░ ░░░     ░░░     ░░░░░░      ░░░
```

# stripe-mcp

> **The most complete open-source MCP server for Stripe.** 79 tools. 19 categories. One command.

[![Build Status](https://img.shields.io/github/actions/workflow/status/guillaumeCode2012/stripe-mcp/ci.yml?branch=main&label=CI)](https://github.com/guillaumeCode2012/stripe-mcp/actions)
[![MIT license](https://img.shields.io/badge/license-MIT-green)](./stripe-mcp/LICENSE)
[![MCP Compatible](https://img.shields.io/badge/MCP-compatible-purple)](https://modelcontextprotocol.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](./stripe-mcp/tsconfig.json)
[![Stars](https://img.shields.io/github/stars/guillaumeCode2012/stripe-mcp?style=social)](https://github.com/guillaumeCode2012/stripe-mcp)

**Manage your entire Stripe account — customers, subscriptions, invoices, and analytics — with natural language.** Works with Claude Desktop, Cursor, Windsurf, and any MCP-compatible AI client.

🌐 **Landing page**: [stripe-mcp.vercel.app](https://stripe-mcp.vercel.app)

---

## What is this?

- **stripe-mcp** (`stripe-mcp/`) — the MCP server. Install it globally, wire it into Claude, and interact with Stripe via natural language.
- **Landing page** (`src/`) — a Next.js marketing site deployed on Vercel. Showcases the product, tools table, playground, and documentation.

---

## Quick start

### Install

```bash
npm install -g @guillaumecode2012/stripe-mcp
```

### Get a Stripe key

Get a restricted test key from the [Stripe dashboard](https://dashboard.stripe.com/apikeys). It starts with `sk_test_`.

```bash
export STRIPE_SECRET_KEY=sk_test_...
```

### Configure your MCP client

**Claude Desktop** — edit `claude_desktop_config.json` (macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "stripe": {
      "command": "stripe-mcp",
      "env": { "STRIPE_SECRET_KEY": "sk_test_..." }
    }
  }
}
```

**Cursor** — edit `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "stripe": {
      "command": "stripe-mcp",
      "env": { "STRIPE_SECRET_KEY": "sk_test_..." }
    }
  }
}
```

**Windsurf** — edit `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "stripe": {
      "command": "stripe-mcp",
      "env": { "STRIPE_SECRET_KEY": "sk_test_..." }
    }
  }
}
```

Restart your AI client and start talking to Stripe.

---

## Tools overview

| Category | Tools | Description |
|---|---|---|
| **Customers** | 6 | Create, get, update, delete, list, search |
| **Products** | 5 | Create, get, update, archive, list |
| **Prices** | 4 | Create, get, update, list |
| **Subscriptions** | 8 | Create, get, update, cancel, pause, resume, list, search |
| **Invoices** | 6 | Get, list, pay, void, finalize, send |
| **Payment Intents** | 5 | Create, get, confirm, cancel, list |
| **Refunds** | 3 | Create, get, list |
| **Disputes** | 4 | Get, update, close, list |
| **Webhooks** | 5 | Create, get, update, delete, list |
| **Coupons** | 4 | Create, get, delete, list |
| **Promotion Codes** | 3 | Create, get, list |
| **Payment Links** | 4 | Create, get, update, list |
| **Checkout** | 4 | Create, get, expire, list sessions |
| **Billing Portal** | 1 | Create customer portal session |
| **Balance** | 2 | Get balance, list transactions |
| **Payouts** | 4 | Create, get, cancel, list |
| **Tax** | 3 | Create, get, list rates |
| **Meters** | 3 | Create, get, list billing meters |
| **Analytics** | 5 | MRR, churn rate, revenue summary, top customers, failed payments report |
| **Total** | **79** | |

### Analytics spotlight

The analytics category is the crown jewel. It computes MRR, churn, revenue summaries, top customers, and failed-payment reports entirely **client-side** by paginating Stripe resources — no external service needed. Stripe has no native MRR endpoint; stripe-mcp implements the canonical Baremetrics/ChartMogul methodology.

---

## Architecture

```
stripe-mcp/
├── src/
│   ├── index.ts          # Entry point — boots StdioServerTransport
│   ├── server.ts         # createServer() — wires allTools into MCP Server
│   ├── config.ts         # Stripe client factory + key validation
│   ├── cli.ts            # --help, --version, --list-tools, --doctor
│   ├── doctor.ts         # 5-check health diagnostic
│   ├── types/            # ToolDefinition, JsonSchemaProperty
│   ├── utils/            # pagination, currency formatting, date helpers
│   └── tools/            # 19 category folders, 79 tools total
│       ├── customers/    # 6 tools
│       ├── products/     # 5 tools
│       ├── prices/       # 4 tools
│       ├── subscriptions/# 8 tools
│       ├── invoices/     # 6 tools
│       ├── analytics/    # 5 tools
│       └── ...           # 13 more categories
├── tests/                # Vitest — all Stripe calls mocked with vi.mock()
├── dist/                 # Bundled output (tsup, ESM, Node 20+)
├── tsup.config.ts
├── vitest.config.ts
└── tsconfig.json
```

**Key design decisions** ([DECISIONS.md](./stripe-mcp/DECISIONS.md)):

- **Stdio only** — no HTTP server, no ports, no auth headers. The MCP client spawns stripe-mcp as a child process.
- **Zod everywhere** — every tool input is runtime-validated. JSON Schemas mirrored for the MCP protocol.
- **Typed end-to-end** — TypeScript strict mode, `exactOptionalPropertyTypes`, zero `any`. Stripe SDK types flow all the way through.
- **Auto-pagination** — list tools paginate through ALL results up to `max_items` (default 1000). No partial pages.
- **Mocked tests** — zero real Stripe API calls in CI. Everything mocked with `vi.mock()`.

---

## Development

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
git clone https://github.com/guillaumeCode2012/stripe-mcp.git
cd stripe-mcp/stripe-mcp
npm ci
```

### Commands

| Command | Description |
|---|---|
| `npm run build` | Build to `dist/` with tsup |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) |
| `npm run lint` | ESLint |
| `npm test` | Vitest run |
| `npm run dev` | Watch mode with tsx |
| `npm run format` | Prettier |

### Quality gates

All must pass before pushing:

1. `npm run typecheck` — zero errors
2. `npm run lint` — zero warnings
3. `npm run build` — `dist/index.js` exists
4. `npm test` — all 83 tests pass
5. `node dist/index.js --list-tools` — starts without error

### Adding a new tool

See [CONTRIBUTING.md](./stripe-mcp/CONTRIBUTING.md) for the full guide. Quick template:

1. Create `src/tools/<category>/<action>.ts`
2. Define zod schema + handler + ToolDefinition export
3. Add to `src/tools/<category>/index.ts`
4. Add tests in `tests/tools/<category>.test.ts`
5. Run quality gates

---

## CI/CD

| Workflow | Trigger | Description |
|---|---|---|
| **CI** (`ci.yml`) | Push/PR to `main` | TypeScript check, lint, build, test on Node 20.x & 22.x |
| **Release** (`release.yml`) | Tag `v*` | Build, test, publish to npm |
| **Landing CI** (`landing-ci.yml`) | Push/PR to `main` | Lint + build the Next.js landing page |
| **Vercel** | Push to `main` | Auto-deploy landing page to `stripe-mcp.vercel.app` |

---

## Deploying the landing page

The landing page is a Next.js 16 app (App Router, Tailwind CSS v4, shadcn/ui, Framer Motion). It auto-deploys to Vercel on every push to `main`.

### Manual deploy

```bash
bun install
bun run build
```

The build outputs to `.next/standalone/`. Serve with:

```bash
NODE_ENV=production bun .next/standalone/server.js
```

### Docker production deploy

A Caddy reverse proxy config is included (`Caddyfile`). Set `DOMAIN` env var for HTTPS:

```bash
DOMAIN=stripe-mcp.com caddy run --config Caddyfile
```

---

## Environment variables

### stripe-mcp server

| Variable | Required | Description |
|---|---|---|
| `STRIPE_SECRET_KEY` | **Yes** | Stripe secret key (`sk_test_...`, `sk_live_...`, or restricted `rk_...`) |

Key detection:
- `sk_test_*` → test mode (safe)
- `sk_live_*` → live mode (warns on startup)
- `rk_*` → restricted key
- Missing → throws clear error

### Landing page

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | No | SQLite database path for Prisma |
| `SITE_URL` | No | Base URL for sitemap/OG (defaults to Vercel domain) |

---

## Safety

- **Test-mode keys (`sk_test_`)** are fully safe — no real money, no real customers. stripe-mcp detects them and shows a green banner.
- **Live-mode keys (`sk_live_`)** show a prominent red warning on startup: "LIVE MODE — real money, real customers."
- **Restricted keys (`rk_`)** are recommended for production use. Scope them to only the resources stripe-mcp needs.
- **Human-in-the-loop** — destructive actions (delete customer, cancel subscription, close dispute) return a clear summary for the AI to present before executing.

---

## Docker

```bash
# Build
docker build -t stripe-mcp:1.0.0 ./stripe-mcp

# Run
docker run --rm -i -e STRIPE_SECRET_KEY=sk_test_... stripe-mcp:1.0.0

# Doctor check
docker run --rm -i -e STRIPE_SECRET_KEY=sk_test_... stripe-mcp:1.0.0 --doctor

# List tools
docker run --rm -i stripe-mcp:1.0.0 --list-tools

# Compose
STRIPE_SECRET_KEY=sk_test_... docker compose -f stripe-mcp/docker-compose.yml up --build
```

---

## FAQ

**Q: Why not use Stripe's API directly with an AI?**  
A: You can. But stripe-mcp gives you auto-pagination, analytics (MRR, churn), formatted currency strings, dual date formats, safe error handling, and 79 pre-built tools with validated inputs. It's the difference between "write a Stripe API call" and "show me my MRR."

**Q: Does this require a server?**  
A: No. stripe-mcp runs locally on your machine via stdio. No ports, no network, no infrastructure.

**Q: Is it safe to use in production?**  
A: Yes. Use a restricted key (`rk_`), scope it to read-only or minimal write access, and stripe-mcp will detect live mode and warn you.

**Q: What MCP clients does it work with?**  
A: Claude Desktop, Cursor, Windsurf, and any MCP-compatible client. Tested primarily with Claude.

**Q: How do I report a bug or request a feature?**  
A: [Open an issue](https://github.com/guillaumeCode2012/stripe-mcp/issues).

---

## License

MIT © stripe-mcp contributors. See [LICENSE](./stripe-mcp/LICENSE).
