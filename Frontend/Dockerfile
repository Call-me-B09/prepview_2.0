# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Set build arguments with defaults matching the local .env file
ARG VITE_DB_SERVICE_URL=http://localhost:5000/db
ARG VITE_ORCHESTRATION_SERVICE_URL=http://localhost:4000
ARG VITE_FIREBASE_API_KEY=AIzaSyAqOkN6z7PjxAF0MouIrQyVXt70zO5gM6Q
ARG VITE_FIREBASE_PROJECT_ID=prepview-2
ARG VITE_FIREBASE_STORAGE_BUCKET=prepview-2.firebasestorage.app
ARG VITE_FIREBASE_AUTH_DOMAIN=prepview-2.firebaseapp.com
ARG VITE_FIREBASE_MESSAGING_SENDER_ID=812685909738
ARG VITE_FIREBASE_APP_ID=1:812685909738:web:ce2e39426aaa4e49bb8193

# Inject arguments into environment variables for Vite build to pick up
ENV VITE_DB_SERVICE_URL=$VITE_DB_SERVICE_URL
ENV VITE_ORCHESTRATION_SERVICE_URL=$VITE_ORCHESTRATION_SERVICE_URL
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID

# Build the application
RUN npm run build

# Serve stage using Nginx
FROM nginx:stable-alpine

# Copy built static assets to Nginx public folder
COPY --from=build /app/dist /usr/share/nginx/html

# Ensure Nginx has permission to read the assets
RUN chmod -R 755 /usr/share/nginx/html

# Expose Nginx port
EXPOSE 80

# Run nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
