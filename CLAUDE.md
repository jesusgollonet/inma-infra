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
- Uses hardcoded image ID `40093247` for the Hetzner Cloud server
- Manages DNS records for `comencemosporelfinal` domain

### Application Stack (Docker Compose)
- **Caddy**: Reverse proxy and automatic HTTPS (ports 80/443)
- **WordPress**: Latest WordPress container
- **MariaDB**: Database backend
- All services connected via `wp_net` network

### Secret Management
Three environment files are used:
- `.env`: Common variables (cloud tokens, AWS keys)
- `.env.prod`: Production-specific secrets (DB passwords)
- `.env.staging`: Staging-specific secrets

## Common Commands

### Infrastructure Management
```bash
# Deploy meta infrastructure (S3 backup bucket)
cd infra/meta
pulumi up

# Deploy server infrastructure
cd infra/server
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

### Development
```bash
# TypeScript compilation (for Pulumi projects)
cd infra/server  # or infra/meta
npm install
tsc  # TypeScript compilation
```

## Important File Locations

- `infra/server/index.ts`: Main server infrastructure definition
- `infra/meta/index.ts`: Backup infrastructure (S3 bucket)
- `app/docker-compose.yml`: Application service definitions
- `app/Caddyfile`: Caddy reverse proxy configuration
- `bin/env_to_gh_secrets`: Utility script for managing GitHub secrets

## Dependencies and Package Management

Both Pulumi projects use npm for dependency management:
- `infra/server/package.json`: Hetzner Cloud and DNS providers
- `infra/meta/package.json`: AWS provider

No test runners, linters, or build tools are configured in the package.json files.

## Deployment Notes

- GitHub Actions automatically deploys the Docker Compose stack
- Environment variables are managed through GitHub secrets
- The server image is pre-built with Packer and uses a hardcoded ID
- DNS is managed through Hetzner DNS provider
- Backups are stored in AWS S3