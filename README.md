# inma-infra
Nice little setup for running a couple of wordpress sites on a bare vps

## Elements

- Packer to create the base image. This will be hosted on Digitalocean but I
  want the flexibility to move providers
- Pulumi to spin up the infra
- Docker Compose to run the services, including
    - Caddy
    - Wordpress
    - MySQL
    - Ideally some monitoring (TBD)








