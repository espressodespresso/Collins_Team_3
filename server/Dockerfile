FROM node:18-alpine

RUN npm i nodemon -g

USER node

RUN mkdir /home/node/server

WORKDIR /home/node/server

COPY --chown=node:node package-lock.json package.json ./

RUN npm ci

COPY --chown=node:node . .

EXPOSE 3000

CMD ["npm", "start"]
