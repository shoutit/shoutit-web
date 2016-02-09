FROM node:4

RUN mkdir /src
WORKDIR /src
ADD . /src

ENV NODE_ENV=production
ENV PORT=8080
ENV HOST=localhost
ENV SHOUTIT_ENV=stage

RUN npm install
RUN npm run build

EXPOSE 8080

CMD npm start
