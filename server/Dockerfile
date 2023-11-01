FROM node:18.13.0

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/

RUN npm install

RUN npm install -g nodemon

COPY . .

EXPOSE 3001

# ENV PATH /usr/local/lib/node_modules/.bin:$PATH

RUN npx prisma generate
# RUN npx prisma migrate dev --name init
# RUN npx prisma migrate dev
CMD ["npm", "run", "start"]