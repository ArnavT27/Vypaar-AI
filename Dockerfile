FROM node:20-alpine

WORKDIR /app

# Copy package configurations
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Expose the port Vite is running on
EXPOSE 8080

# Start the Vite development server binding to 0.0.0.0 to allow external access
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8080"]
