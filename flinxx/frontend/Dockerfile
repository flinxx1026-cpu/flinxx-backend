FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/dist2 ./dist2
EXPOSE 3000
CMD ["npx", "serve", "-s", "dist2", "-l", "3000"]
