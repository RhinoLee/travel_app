FROM node:16.14.0-alpine AS build
WORKDIR /src
COPY . .
RUN npm install
RUN npm run build

# STEP2 CREATE NGINX SERVER
FROM nginx:1.21.6-alpine AS prod-stage
COPY --from=build /src/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx","-g","daemon off;"]

