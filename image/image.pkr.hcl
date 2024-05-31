# packer.pkr.hcl
variable "hcloud_token" {
  type = string
  default =""
  sensitive = true
}

variable "version" {
  type = string
  default = "v0.1"
}

variable "name" {
  type = string
  default = "inma-infra"
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
  ssh_keys = ["inma-infra"]
  ssh_username = "root"
  snapshot_name = var.name  
  snapshot_labels = {
    version = var.version 
    name = var.name
  }
}

build {
  sources  = ["source.hcloud.inma-instance"]
  provisioner "shell" {
    scripts = [
      "provision.sh"
    ]
  }
  post-processor "manifest" {
    output = "manifest.json"
  }
}
