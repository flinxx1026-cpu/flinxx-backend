FROM node:18-bullseye

WORKDIR /app

# Install libssl1.1 for Prisma compatibility
RUN apt-get update \
  && apt-get install -y curl \
  && curl -L -o /tmp/libssl1.1.deb http://security.debian.org/debian-security/pool/updates/main/o/openssl/libssl1.1_1.1.1n-0+deb11u5_amd64.deb \
  && dpkg -i /tmp/libssl1.1.deb || true \
  && apt-get install -fy

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
