#!/bin/bash

echo "Provisioning virtual machine..."

set -e

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Use the new repository setup
echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu noble stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update and install Docker
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io
