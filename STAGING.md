# Staging Environment

This document explains how to use the staging environment for safe testing.

## Overview

The staging environment provides:
- **Isolated infrastructure**: Separate Hetzner server and DNS subdomain
- **Multi-site testing**: Support for testing multiple WordPress sites
- **Safe deployment**: No impact on production environment

## Infrastructure

### Staging Server
- **Pulumi Stack**: `staging`
- **DNS**: `staging.comencemosporelfinal.com`
- **Server**: Separate Hetzner Cloud instance
- **Branch**: `40-create-staging-environment`

### Production Server
- **Pulumi Stack**: `inma2`
- **DNS**: `comencemosporelfinal.com`
- **Server**: Production Hetzner Cloud instance
- **Branch**: `main`

## Deployment

### Automatic Deployment
Staging automatically deploys when you push to the `40-create-staging-environment` branch:

1. **Infrastructure changes** (`infra/server/**`) trigger `provision-staging.yml`
2. **App changes** (`app/**`) trigger `deploy-staging.yml`
3. **Successful provisioning** also triggers deployment

### Manual Deployment
To deploy staging manually:

```bash
# Infrastructure
cd infra/server
pulumi up --stack staging

# Application
# Push app changes to 40-create-staging-environment branch
```

## Multi-Site Configuration

### Single Site (Default)
The staging environment runs a single WordPress site by default.

### Multi-Site Testing
To enable a second WordPress site:

1. **Set GitHub secrets** in the `staging` environment:
   ```
   WP2_HOSTNAME=second-blog.comencemosporelfinal.com
   WORDPRESS_DB_NAME2=wp2
   ```

2. **Deploy**: The deployment will automatically detect the second site configuration and start the multi-site services.

## Environment Variables

### Required (Staging Environment)
- `WP1_HOSTNAME`: Primary site hostname
- `WORDPRESS_DB_*`: Database configuration
- `MYSQL_ROOT_PASSWORD`: Database root password
- `SERVER_IP`: Staging server IP (auto-set by provision workflow)

### Optional (Multi-Site)
- `WP2_HOSTNAME`: Second site hostname
- `WORDPRESS_DB_NAME2`: Second site database name (defaults to `wp2`)

## Teardown

To destroy staging infrastructure:

```bash
cd infra/server
pulumi destroy --stack staging
```

## Testing Workflow

1. **Make changes** on `40-create-staging-environment` branch
2. **Test on staging**: `https://staging.comencemosporelfinal.com`
3. **Test multi-site** (if enabled): Configure second hostname
4. **Merge to main** when ready for production

## DNS Records

- **Production**: `comencemosporelfinal.com` + `www.comencemosporelfinal.com`
- **Staging**: `staging.comencemosporelfinal.com`
- **Second site**: Configure custom domain via `WP2_HOSTNAME`