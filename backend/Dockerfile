FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy Prisma schema
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Copy all backend source code
COPY . .

# Expose correct backend port
EXPOSE 10000

# Start the server directly
CMD ["node", "server.js"]
