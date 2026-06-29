FROM node:18-alpine

WORKDIR /app

# Install deps first (layer caching)
COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Create uploads directory
RUN mkdir -p uploads/avatars uploads/vendors

EXPOSE 5000

CMD ["node", "src/server.js"]
