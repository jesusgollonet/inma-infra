#!/bin/bash

echo "Provisioning virtual machine..."

set -e

# Variables
USERNAME="deployuser"
USER_HOME="/home/$USERNAME"
PROJECT_DIR="$USER_HOME/app"
SSH_DIR="$USER_HOME/.ssh"
# Create a new user
adduser --disabled-password --gecos "" $USERNAME

# Add the user to the sudo group
usermod -aG sudo "$USERNAME"

# Set up SSH access for the new user
mkdir -p $SSH_DIR
cp /root/.ssh/authorized_keys $SSH_DIR/
chown -R "$USERNAME":"$USERNAME" "$SSH_DIR"
chmod 700 "$SSH_DIR"
chmod 600 "$SSH_DIR"/authorized_keys

# Disable root SSH login
sed -i 's/^PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
systemctl restart ssh


# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Use the new repository setup
echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu noble stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update and install Docker
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io

# Add the new user to the Docker group
usermod -aG docker "$USERNAME"

# Set up the project directory
mkdir -p "$PROJECT_DIR"
chown -R "$USERNAME":"$USERNAME" "$PROJECT_DIR"

