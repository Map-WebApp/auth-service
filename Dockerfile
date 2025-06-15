FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
EXPOSE 3007

# Thiết lập các biến môi trường trực tiếp trong Dockerfile
ENV PORT=3007
ENV JWT_SECRET=maps_webapp_secret_key
ENV USER_SERVICE_URL=http://user-service:8080

# Chạy server và script tạo người dùng
CMD ["npm", "start"]
