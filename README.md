# inma-infra
Nice little setup for running a couple of wordpress sites on a bare vps.

## Elements

- Packer to create the base image. This will be hosted on Hetzner but I
  want the flexibility to move providers
- Pulumi to spin up the infra
- Docker Compose to run the services, including
    - Caddy
    - Wordpress
    - MySQL
    - Ideally some monitoring (TBD)


## Instructions

### Build base image (Packer)

Get the Hetzner API token and set it as an environment variable

```shell
cd image

packer build -var 'hetzner_token=your_token' image.pkr.hcl 

```
Note down the image ID at the end of the build process. This will be used in the next step.

### Deploy infra (Pulumi)

```shell
cd instance
pulumi config set hcloud:token $HCLOUD_TOKEN --secret
pulumi up
```




