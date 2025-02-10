FROM node:slim

# Install minimal required tools and clean up in same layer
RUN apt-get update && \
    apt-get install -y --no-install-recommends git curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    mkdir -p /workspaces/ha-unary-clock-card/node_modules/ && \
    chown -R node:node /workspaces/ha-unary-clock-card/node_modules/ && \
    npm install -g pnpm

# Set the working directory
WORKDIR /workspace
