FROM node:lts

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install --frozen-lockfile

COPY . .

RUN npm run build-prod

ENV NODE_ENV production

RUN npm i -g prisma pm2

RUN prisma generate

RUN mkdir -p /usr/src/app/logs && chown -R node:node /usr/src/app/logs

USER node

EXPOSE 3000

CMD ["pm2-runtime", "build/index.js"]
