FROM node:18.13.0

WORKDIR /usr/app

COPY . .
RUN rm -r package-lock.json node_modules
RUN npm install


EXPOSE 3001

RUN npx prisma generate

CMD [ "npm","run","start"]