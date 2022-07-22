FROM node:16-alpine3.11

WORKDIR /sns/

RUN apk update
RUN apk upgrade

COPY ./package.json /sns/
COPY ./yarn.lock /sns/

RUN yarn install

COPY . /sns/

CMD yarn start:dev
