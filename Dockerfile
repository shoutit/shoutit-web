FROM node:4

ARG SHOUTIT_API_URL
ARG SHOUTIT_PUBLIC_URL

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
ENV SHOUTIT_API_URL=$SHOUTIT_API_URL
ENV SHOUTIT_PUBLIC_URL=$SHOUTIT_PUBLIC_URL

CMD npm start
