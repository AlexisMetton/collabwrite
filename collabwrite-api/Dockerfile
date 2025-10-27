FROM node:24-alpine

WORKDIR /app

COPY package.json /app

RUN npm install

COPY prisma ./prisma/

COPY . .

CMD ["sh", "-c", "npx prisma generate && node server.ts"]