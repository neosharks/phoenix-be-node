FROM node:lts

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

ENV NODE_ENV production

RUN yarn global add prisma pm2

RUN prisma generate

RUN mkdir -p /usr/src/app/logs && chown -R node:node /usr/src/app/logs

USER node

EXPOSE 3000

CMD ["pm2-runtime", "build/index.js"]
