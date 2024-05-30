# packer.pkr.hcl
variable "hcloud_token" {
  type = string
  default =""
}

packer {
  required_plugins {
    hcloud = {
      source  = "github.com/hetznercloud/hcloud"
      version = ">= 1.4.0"
    }
  }
}

source "hcloud" "inma-instance" {
  image = "ubuntu-24.04"
  token = var.hcloud_token
  location = "nbg1"
  server_type = "cx11"
  ssh_username = "root"
}

build {
  sources  = ["source.hcloud.inma-instance"]
}
