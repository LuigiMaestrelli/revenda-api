#
# Builder stage.
#
FROM node:16.2.0 AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn*.lock ./
COPY tsconfig*.json ./
COPY ./src ./src

RUN yarn install 
RUN yarn build

#
# Production stage.
#
FROM node:16.2.0-alpine as production

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY yarn*.lock ./
COPY tsconfig*.json ./
COPY databaseConfig.json ./
COPY systemConfig.json ./
RUN yarn install --prod

COPY --from=builder /usr/src/app/dist ./dist