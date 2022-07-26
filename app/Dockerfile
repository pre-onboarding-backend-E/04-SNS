FROM node:16-alpine3.11

WORKDIR /app
COPY . .
RUN yarn install
# 우선 ENV 이렇게 사용하지만 ENV 이름이 노출되므로 대안이 필요하다..
ENV MONGO_DB_USERNAME=0 \
    MONGO_DB_PASSWORD=0 \
    MONGO_DB_URL=0 \
    JWT_ACCESS_TOKEN_SECRET_KEY=0 \
    JWT_ACCESS_TOKEN_EXPIRESIN=0 \
    JWT_REFRESH_TOKEN_SECRET_KEY=0 \
    JWT_REFRESH_TOKEN_EXPIRESIN=0 \
    SALT_ROUNDS=0
RUN yarn build
CMD ["yarn", "start:prod"]