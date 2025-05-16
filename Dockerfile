# Build frontend
FROM node:18-alpine as builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Serve con NGINX
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
