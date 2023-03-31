FROM node:18-alpine

USER node

RUN mkdir /home/node/server

WORKDIR /home/node/server

COPY --chown=node:node ./server/package-lock.json ./server/package.json ./

RUN npm ci --production

COPY --chown=node:node ./server .

EXPOSE 3000

CMD ["npm", "start"]