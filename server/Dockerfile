FROM node:18.13.0

WORKDIR /usr/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

RUN npx prisma generate

CMD [ "npm","run","start"]