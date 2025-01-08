# Use a more recent version of Node.js
FROM node:20-alpine

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

# Copy SSL certificates
COPY server.key server.cert ./

# Copy wait-for-it script
COPY wait-for-it.sh ./

# Build the TypeScript code
RUN npm run build

# Expose the application port
EXPOSE 8000

COPY entrypoint.sh ./

CMD ["sh", "./entrypoint.sh"]


