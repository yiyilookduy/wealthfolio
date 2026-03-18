# Wealthfolio Fork — YIYI Capital

> Forked from [afadil/wealthfolio](https://github.com/afadil/wealthfolio) on 2026-03-18
> Fork: [yiyilookduy/wealthfolio](https://github.com/yiyilookduy/wealthfolio)
> Image: `ghcr.io/yiyilookduy/wealthfolio:latest`

---

## 📋 Overview

Wealthfolio is a full-stack portfolio management app (Rust backend + React frontend).
YIYI Capital uses it as **Track A** — the portfolio management surface.

This is a **forked repo** — the strategy is **Addon-First**: minimize core changes, extend via the addon system, keep upstream merge ability.

---

## 🏗️ Architecture

```
apps/frontend/    ← React + Vite + Tailwind + Shadcn/UI
apps/server/      ← Axum HTTP server (web/Docker mode)
apps/tauri/       ← Tauri desktop wrapper (NOT used by YIYI)
crates/           ← Rust shared backend (core, storage-sqlite, market-data, ai, etc.)
packages/         ← @wealthfolio/addon-sdk, @wealthfolio/ui, addon-dev-tools
addons/           ← Addon implementations (including YIYI BTC Intelligence — Phase 5A)
```

### Adapter System
- Web mode: Frontend → REST API → Axum → crates/core
- Desktop mode: Frontend → Tauri IPC → crates/core
- YIYI uses **web mode only** (Docker container on Synology NAS)

### Addon System
- TypeScript modules exporting `enable(ctx: AddonContext)`
- `AddonContext` provides: sidebar, router, 14 domain APIs
- Addons register sidebar items + routes + components
- Cleanup via `ctx.onDisable()`

---

## ⚠️ Customization Rules (CRITICAL)

### 🟢 SAFE — freely modify
| Area | Conflict Risk |
|------|:-------------:|
| New addons (`addons/yiyi-*/`) | ZERO |
| Theme/CSS (`apps/frontend/src/globals.css`) | LOW |
| Branding (app-icon, titles) | LOW |
| Docker config (compose.yiyi.yml) | ZERO |
| CI/CD (.github/workflows/docker-publish.yml) | LOW |

### 🔴 DO NOT TOUCH — upstream will conflict
| Area | Reason |
|------|--------|
| `crates/*` (Rust core) | Upstream refactors constantly |
| `crates/storage-sqlite/migrations/` | Schema must match upstream |
| `packages/addon-sdk/` | APIs must stay compatible |

---

## 🔄 Git Workflow

```bash
# Push custom code:
git push origin main

# Pull upstream updates:
git fetch upstream
git merge upstream/main

# Upstream remote:
git remote -v
# origin   → https://github.com/yiyilookduy/wealthfolio.git (fork)
# upstream → https://github.com/afadil/wealthfolio.git (original)
```

---

## 🐳 Docker

- **Image:** `ghcr.io/yiyilookduy/wealthfolio:latest`
- **CI/CD:** GitHub Actions auto-builds on push to main
- **Deploy:** Part of `d:\Projects\Investment\docker-compose.synology.yml`
- **Access:** http://192.168.1.103:8088

---

## 🔗 Related Projects

| Project | Path | Purpose |
|---------|------|---------|
| **Investment** (main repo) | `d:\Projects\Investment\` | Track B backend, docs, deployment configs |
| **Wealthfolio** (this repo) | `d:\Projects\Wealthfolio\` | Track A portfolio management |

Shared docs live in Investment repo: `docs/superpowers/plans/track-a-portfolio-roadmap.md`

---

## Run Commands

| Task | Command |
|------|---------|
| Web dev | `pnpm run dev:web` |
| Desktop dev | `pnpm tauri dev` |
| Addon dev | `pnpm dev:addons` |
| Tests (TS) | `pnpm test` |
| Tests (Rust) | `cargo test` |
| Type check | `pnpm type-check` |
| Lint | `pnpm lint` |
| Build Docker | `docker build -t wealthfolio .` |
