FROM node:4

RUN mkdir /src

WORKDIR /src
ADD . /src
RUN npm install
RUN npm run build

EXPOSE 8080

CMD NODE_ENV=production SHOUTIT_ENV=stage npm start
