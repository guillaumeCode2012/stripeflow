# StripeFlow

AI agents call Stripe APIs blindly. They hallucinate parameters, skip validation, and run destructive operations with no guardrails. StripeFlow gives them typed, scoped, validated tools instead.

---

## Why this exists

Giving an LLM a raw Stripe API key is dangerous. One hallucinated `DELETE /v1/customers` and your production data is gone. StripeFlow wraps every Stripe API operation behind a typed MCP tool with runtime validation, scope awareness, and explicit safety warnings for live-mode keys.

It also computes analytics (MRR, churn, revenue) client-side — Stripe has no native MRR endpoint. No data warehouse. No Sigma. No SQL.

---

## What this solves

- AI agents calling raw HTTP APIs with no type checking
- Hallucinated parameters reaching the Stripe API
- Missing pagination (agents assume one page = all results)
- No visibility into what an agent did or charged
- No safe mode for development vs production keys
- Stripe analytics require external services (Baremetrics, ChartMogul)

---

## Demo

Three operations. One session. No API keys typed manually.

1. **Create a customer** — the agent calls `stripe_customers_create` with name and email. StripeFlow validates the input, returns the customer object with formatted dates and currency.

2. **Create a subscription** — the agent attaches a price to the customer. StripeFlow handles proration, trial periods, and returns the full subscription object.

3. **Refund the last charge** — the agent calls `stripe_refunds_create` with the charge ID. StripeFlow returns a summary before executing, so you can review the operation.

---

## Key features

- **79 typed tools** across 19 Stripe resource categories
- **Zod validation on every input** — the LLM never sends raw JSON to Stripe
- **Auto-pagination** — list endpoints iterate through every page up to a configurable cap
- **Dual currency formatting** — every monetary field returns both raw cents and a human-readable string (`"$12.50"`)
- **Dual date formatting** — every date field returns both Unix timestamp and ISO 8601
- **Key type detection** — `sk_test_` shows a safe-mode indicator; `sk_live_` prints a red warning on startup
- **5 analytics tools** — MRR, churn rate, revenue summary, top customers, failed payments. Computed client-side from Stripe data
- **Stdio transport** — no HTTP server, no ports, no network. Runs as a child process of your MCP client
- **83 tests, zero real API calls** — all Stripe interactions mocked with vitest

---

## Installation

```bash
npm install -g @guillaume_code_2012/stripeflow
```

Set your Stripe key:

```bash
export STRIPE_SECRET_KEY=sk_test_...
```

Add to your MCP client config:

```json
{
  "mcpServers": {
    "stripe": {
      "command": "stripeflow",
      "env": { "STRIPE_SECRET_KEY": "sk_test_..." }
    }
  }
}
```

Works with Claude Desktop, Cursor, Windsurf, and any MCP-compatible client.

---

## Example

User prompt: *"Subscribe Sarah to the Pro plan and charge her card."*

The AI agent calls these StripeFlow tools in sequence:

```
stripe_customers_search    → find sarah@acme.io
stripe_prices_list         → get the Pro plan price ID
stripe_subscriptions_create → subscribe cus_xxx to price_xxx
```

Each call is type-checked. The agent never touches a raw Stripe endpoint. If the customer doesn't exist, the search returns an empty list instead of a 404 the agent would misinterpret.

---

## Why MCP

MCP (Model Context Protocol) is a standard for AI agents to call external tools. Instead of parsing raw HTTP responses and guessing at pagination, the agent calls a typed function with a JSON schema. The server validates inputs, handles errors, and returns structured data.

StripeFlow implements the MCP server spec over stdio. Your AI client spawns it as a child process and communicates via JSON-RPC on stdin/stdout. No network config. No OAuth dance. No token management beyond the Stripe key you already have.

---

## Tools

| Category | Count | Operations |
|---|---|---|
| Customers | 6 | create, get, update, delete, list, search |
| Products | 5 | create, get, update, archive, list |
| Prices | 4 | create, get, update, list |
| Subscriptions | 8 | create, get, update, cancel, pause, resume, list, search |
| Invoices | 6 | get, list, pay, void, finalize, send |
| Payment Intents | 5 | create, get, confirm, cancel, list |
| Refunds | 3 | create, get, list |
| Disputes | 4 | get, update, close, list |
| Webhooks | 5 | create, get, update, delete, list |
| Coupons | 4 | create, get, delete, list |
| Promotion Codes | 3 | create, get, list |
| Payment Links | 4 | create, get, update, list |
| Checkout | 4 | create, get, expire, list |
| Billing Portal | 1 | create session |
| Balance | 2 | get, list transactions |
| Payouts | 4 | create, get, cancel, list |
| Tax | 3 | create, get, list |
| Meters | 3 | create, get, list |
| Analytics | 5 | MRR, churn, revenue, top customers, failed payments |

---

## Safety

- **`sk_test_` keys** — green indicator. No real charges possible.
- **`sk_live_` keys** — red warning on startup. "LIVE MODE — real money."
- **`rk_` restricted keys** — recommended for production. Scope by resource and permission.
- **Destructive tools** — return a confirmation summary before executing. The agent must present it to you.

---

## Docker

```bash
docker build -t stripeflow:1.0.0 ./stripeflow
docker run --rm -i -e STRIPE_SECRET_KEY=sk_test_... stripeflow:1.0.0
```

---

## Development

```bash
git clone https://github.com/guillaumeCode2012/stripeflow.git
cd stripeflow/stripeflow
npm ci
npm test
```

Quality gates: `npm run typecheck`, `npm run lint`, `npm run build`, `npm test`.

---

## License

MIT
