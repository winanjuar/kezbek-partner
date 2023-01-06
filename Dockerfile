FROM node:18-alpine
RUN apk add --no-cache --virtual .build-deps alpine-sdk python3
RUN mkdir -p /var/www/partner
WORKDIR /var/www/partner
ADD . /var/www/partner
RUN npm install
CMD npm start