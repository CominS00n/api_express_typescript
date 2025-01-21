# Use a more recent version of Node.js
FROM node:20-alpine

# Install dependencies
RUN apk add --no-cache bash curl postgresql-client

# Download and install dockerize
RUN curl -sSL https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-alpine-linux-amd64-v0.6.1.tar.gz | tar -C /usr/local/bin -xzv

# Create app directory and set permissions
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies as root user
RUN npm install

# Switch to non-root user
USER node

# Copy the rest of the application code
COPY --chown=node:node . .

# Copy wait-for-it script
COPY wait-for-it.sh ./

# Build the TypeScript code
RUN npm run build

# Expose the application port
EXPOSE 8000

# Copy entrypoint script and set execute permissions
COPY entrypoint.sh ./

CMD ["sh", "-c", "./entrypoint.sh"]