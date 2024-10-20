FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN yarn install --production --silent

COPY . .

RUN yarn run build

EXPOSE 3000

CMD ["node", "dist/server.js"]
