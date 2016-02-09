FROM node:4

RUN mkdir /src

WORKDIR /src
ADD . /src
RUN npm install --production

EXPOSE 8080

CMD npm start
