# BTC Intelligence Addon

Wealthfolio addon that displays BTC observability data from the YIYI Capital FastAPI backend.

## Features

- **Regime Tab**: Current BTC regime, directive, domain states (valuation/leverage/macro)
- **Reliability Tab**: System health traffic lights, streak tracking, 30-day history
- **Report Tab**: Full structured report with synthesis, changes, issues, journal

## Setup

1. Install the addon in Wealthfolio
2. Click "BTC Intelligence" in the sidebar
3. Enter your FastAPI backend URL (default: `http://192.168.1.103:8000`)
4. Click "Test Connection" to verify, then "Save"

## Development

```bash
pnpm install          # from Wealthfolio root
cd addons/btc-intelligence
pnpm dev:server       # start dev server with hot reload
pnpm build            # production build
pnpm type-check       # TypeScript verification
```

## Backend API Dependencies

| Endpoint | Tab | Data |
|----------|-----|------|
| `GET /api/v1/btc/latest` | Regime | Regime snapshot |
| `GET /api/v1/obs/synthesis` | Regime | Domain state synthesis |
| `GET /api/v1/obs/health` | Regime, Reliability | Engine health |
| `GET /api/v1/admin/reliability` | Reliability | Reliability status |
| `GET /api/v1/admin/reliability/history` | Reliability | Daily history |
| `GET /api/v1/obs/report` | Report | Full report |
| `GET /api/v1/obs/runs` | Reliability | Run history |
| `GET /api/v1/health` | Settings | Connection test |

## Architecture

```
Browser (Wealthfolio at :8088)
  └── BTC Intelligence Addon (React/JS)
        ├── ctx.api.secrets.get("backend-url")
        └── fetch → FastAPI Backend (:8000, Synology)
```

Read-only bridge. Addon observes — does NOT modify, recompute, or trigger engine actions.

## License

MIT © YIYI Capital
