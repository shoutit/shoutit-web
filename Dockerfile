FROM node:4

# Create app directory
RUN mkdir /src
WORKDIR /src

COPY . /src

RUN npm install

# Bundle app source
# COPY . /src

EXPOSE 8080

ENV NODE_ENV production
CMD npm start
