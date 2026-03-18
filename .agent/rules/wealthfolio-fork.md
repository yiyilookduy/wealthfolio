# YIYI Capital — Wealthfolio Fork Rules

## Addon-First Doctrine
- ALL custom functionality MUST be implemented as addons
- DO NOT modify Rust crates unless absolutely necessary
- DO NOT modify database migrations
- DO NOT modify addon-sdk package
- Frontend CSS/theme changes are OK (low conflict risk)
- New files/folders are always safe (zero conflict risk)

## Upstream Merge Safety
- Before editing ANY file that exists in upstream, consider:
  - Will upstream modify this file in their next release?
  - Can this change be done in an addon instead?
- After merging upstream: always test `pnpm type-check` and `cargo check`

## Docker/Deployment
- Image: `ghcr.io/yiyilookduy/wealthfolio:latest`
- Auto-built by GitHub Actions on push to main
- Deploy config lives in Investment repo: `docker-compose.synology.yml`
- Environment variables in Investment repo: `.env.synology`

## Git Etiquette
- Commit messages: prefix with context
  - `feat(addon):` — addon changes
  - `fix(theme):` — frontend theme/branding
  - `ci:` — GitHub Actions, Docker
  - `docs:` — documentation
  - `upstream:` — merge upstream changes
- NEVER force-push to main
- Feature work on branches: `feature/yiyi-*`
