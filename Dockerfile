# Use a more recent version of Node.js
FROM node:14-alpine

# Create app directory and set permissions
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Switch to non-root user
USER node

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY --chown=node:node . .

# Copy SSL certificates
COPY server.key server.cert ./

# Build the TypeScript code
RUN npm run build

# Expose the application port
EXPOSE 8000

# Start the application
CMD [ "npm", "run", "start" ]