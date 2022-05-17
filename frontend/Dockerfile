FROM node:16.14.0-alpine
WORKDIR /src
COPY . .
RUN npm install
RUN npm run build
COPY ./dist /usr/share/nginx/html

