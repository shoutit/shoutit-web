FROM node:4

# Provides cached layer for node_modules
ADD package.json /tmp/package.json
RUN cd /tmp && npm install --production
RUN mkdir -p /src && cp -a /tmp/node_modules /src/

# Define working directory
WORKDIR /src

COPY . /src

EXPOSE 8080

ENV NODE_ENV production
ENV PORT 8080

CMD npm start
