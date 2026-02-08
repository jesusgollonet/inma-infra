# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a WordPress hosting infrastructure project that uses a multi-layered approach:

1. **Pulumi**: Manages cloud infrastructure (servers, DNS records, S3 backup buckets)
2. **Docker Compose**: Orchestrates the application stack (WordPress, MariaDB, Caddy)
3. **GitHub Actions**: Handles CI/CD deployment pipeline

## Key Components

### Infrastructure (Pulumi)
- **Meta Stack** (`infra/meta/`): Creates AWS S3 bucket for backups
- **Server Stack** (`infra/server/`): Provisions Hetzner Cloud servers and DNS records
- Uses hardcoded image ID `40093247` for the Hetzner Cloud server (pre-built via Packer with Docker)
- DNS zone ID `avxh7DEXYpyLhrRbhVKCqW` is hardcoded in `infra/server/index.ts`
- Pulumi stacks: `inma2` (production), `staging`

### Application Stack (Docker Compose)
- **Caddy**: Reverse proxy and automatic HTTPS (ports 80/443)
- **WordPress**: `wp1` (required), `wp2` (optional, enabled via `multi-site` profile when `WP2_HOSTNAME` is set)
- **MariaDB**: `db1` backend; second database `wp2` created by `init-db.sql`
- All services connected via `wp_net` network

### CI/CD Branches
- `main`: Triggers production deployment (`provision.yml`, `deploy.yml`)
- `40-create-staging-environment`: Triggers staging deployment (`provision-staging.yml`, `deploy-staging.yml`)

### Secret Management
Three environment files are used:
- `.env`: Common variables (cloud tokens, AWS keys, SSH key)
- `.env.prod`: Production-specific secrets (DB passwords, hostnames)
- `.env.staging`: Staging-specific secrets

## Common Commands

### Infrastructure Management
```bash
# Deploy meta infrastructure (S3 backup bucket)
cd infra/meta
pulumi stack select prod
pulumi up

# Deploy server infrastructure (production)
cd infra/server
pulumi stack select inma2
pulumi up

# Deploy server infrastructure (staging)
cd infra/server
pulumi stack select staging
pulumi up

# Set Hetzner Cloud token
pulumi config set hcloud:token $HCLOUD_TOKEN --secret
```

### Application Deployment
```bash
# Deploy services (handled by GitHub Actions)
cd app
docker-compose up -d

# Upload environment secrets to GitHub
bin/env_to_gh_secrets .env
bin/env_to_gh_secrets .env.prod prod
bin/env_to_gh_secrets .env.staging staging
```

### Restore staging from local backup
```bash
SERVER_IP=x.x.x.x SSH_KEY_PATH=~/.ssh/id_rsa bin/restore_staging
```

### Development
```bash
# Install root-level dev tools (husky, lint-staged for actionlint)
npm install

# TypeScript compilation (for Pulumi projects)
cd infra/server  # or infra/meta
npm install
tsc
```

## Important File Locations

- `infra/server/index.ts`: Server + DNS record definitions
- `infra/meta/index.ts`: Backup S3 bucket definition
- `app/docker-compose.yml`: Application service definitions
- `app/Caddyfile`: Production Caddy reverse proxy configuration
- `app/Caddyfile.staging`: Staging variant (copied over Caddyfile at deploy time)
- `bin/env_to_gh_secrets`: Push local env vars to GitHub secrets
- `bin/restore_staging`: Restore backup to staging server

## Deployment Notes

- GitHub Actions automatically deploys the Docker Compose stack on push
- Environment variables are managed through GitHub secrets; deploy workflows SSH in and generate a remote `.env`
- `SERVER_IP` and `BACKUP_BUCKET_NAME` are auto-populated as GitHub secrets by their respective provision workflows
- Backups run daily at 00:00 UTC: wp-content + mariadb-dump uploaded to S3 (cache excluded)
- Pre-commit hook runs `actionlint` on GitHub Actions workflow files via lint-staged
