FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package configurations
COPY package*.json ./

# Install dependencies (only production)
RUN npm ci --only=production

# Copy server code
COPY . .

# Expose backend port
EXPOSE 3000

# Set production environment
ENV PORT=3000
ENV NODE_ENV=production

# Start server
CMD ["node", "server.js"]
