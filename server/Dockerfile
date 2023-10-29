FROM node:18.13.0

WORKDIR /usr/app

COPY . .

RUN npm install


EXPOSE 3001

RUN npx prisma generate
# RUN npx prisma migrate dev
# RUN npx prisma migrate dev --name init

CMD ["npm","run","start"]