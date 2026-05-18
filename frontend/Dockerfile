FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV VITE_API_URL=""

CMD ["sh", "-c", "npm run build && rm -rf /frontend_dist/* && cp -r dist/* /frontend_dist/"]
