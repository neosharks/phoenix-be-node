FROM node as builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

# Install PM2 globally
RUN npm install -g pm2

COPY . .

# Build the application
RUN yarn build

# Second stage, for a smaller image
FROM node:slim

# Install system dependencies including openssl
RUN apt-get update && apt-get install -y openssl

ENV NODE_ENV production

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json yarn.lock ./

RUN yarn install --production --frozen-lockfile

# Install Prisma globally
RUN yarn global add prisma pm2

# Copy Prisma schema
COPY prisma ./prisma

# Generate Prisma Client
RUN prisma generate

# Create logs directory with appropriate permissions
RUN mkdir -p /usr/src/app/logs && chown -R node:node /usr/src/app/logs

# Copy .env file
COPY .env ./

# Copy built files from the previous stage
COPY --from=builder /usr/src/app/dist ./dist

# Set user for security purposes
USER node

# Expose the port
EXPOSE 3000

# Start the application with PM2
CMD [ "pm2-runtime", "dist/index.js" ]
