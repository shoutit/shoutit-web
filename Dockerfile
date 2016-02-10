FROM node:4

# Create app directory
RUN mkdir /src
WORKDIR /src

COPY . /src

RUN npm install
RUN npm run build

EXPOSE 8080

ENV NODE_ENV production
CMD npm start
