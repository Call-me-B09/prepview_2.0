FROM node:24-slim
RUN apt-get update && apt-get install -y curl tar gzip && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run setup

CMD ["npm", "start"]
