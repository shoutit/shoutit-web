FROM gpbl/node-4-intl

ARG SHOUTIT_ENV

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
ENV SHOUTIT_ENV=$SHOUTIT_ENV

CMD npm start
