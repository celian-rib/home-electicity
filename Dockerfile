FROM node:18-alpine

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build
RUN npx prisma generate
RUN npx prisma migrate deploy

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
