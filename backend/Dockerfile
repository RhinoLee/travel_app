FROM node:16.14.0-alpine AS builder
WORKDIR /src
COPY package.json .
RUN npm install

FROM node:16.14.0-alpine
EXPOSE 80

WORKDIR /app
COPY --from=builder /src/node_modules/ /app/node_modules/ 
COPY . .

CMD ["npm", "run", "start"]

# host.docker.internal