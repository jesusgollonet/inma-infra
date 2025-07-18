# inma-infra
Nice little setup for running a couple of wordpress sites on a bare vps.

## Elements

- Pulumi to spin up the infra
- Docker Compose to run the services, including
    - Caddy
    - Wordpress
    - MySQL
    - Ideally some monitoring (TBD)

## Instructions

### Deploy infra (Pulumi)

```shell
cd infra
pulumi config set hcloud:token $HCLOUD_TOKEN --secret
pulumi up
```

### Deploy services (Docker Compose)

Github Actions deploys `app/docker-compose.yml` to the server. 

It needs a few secrets, which are stored in github secrets. 

The script `bin/env_to_gh_secrets` takes a local `app/.env.production` file and
creates the secrets in the github repo through gh cli. Then the pipeline takes
those secrets and creates a remote .env file.

### Secret management

Secrets are managed in gh actions. I use repository level secrets for commmon
ones and environments for app level secrets. So there are 3 env files. 

- `.env` for common env vars (hcloud regular and dns token, aws access keys)
- `.env.prod` for production env vars (db passwords, etc)
- `.env.staging` for staging env vars (db passwords, etc)

I have a utility script that copies the local env vars to gh secrets, optionally
using environments

```shell
# repository secrets
bin/env_to_gh_secrets .env


# prod specific secrets
bin/env_to_gh_secrets .env.prod prod


# staging specific secrets
bin/env_to_gh_secrets .env.staging staging
```
`


