FROM node:4

RUN mkdir /src

RUN npm install nodemon -g  # Todo: not sure why this is installed!

WORKDIR /src
ADD . /src
RUN npm install  # Todo: shouldn't we add `--production`?

EXPOSE 3000

CMD npm run dev  # Todo: define run script for production and use it here
