FROM mcr.microsoft.com/vscode/devcontainers/javascript-node

# Install additional tools
RUN apt-get update && \
    apt-get install -y git curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN  mkdir -p /workspaces/ha-unary-clock-card/node_modules/ && \
     chown -R node:node /workspaces/ha-unary-clock-card/node_modules/

# Install global pnpm
RUN npm install -g pnpm

# Set the working directory
WORKDIR /workspace
