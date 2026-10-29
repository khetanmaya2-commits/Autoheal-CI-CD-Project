FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY server.js .

ENV PORT=3000
ENV APP_VERSION=1.2.0
EXPOSE 3000

USER node

CMD ["npm","start"]



