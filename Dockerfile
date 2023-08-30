FROM node:18

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build
RUN npx prisma generate

EXPOSE 3000

CMD npm run deploy:start
