FROM shoutit/node:8.4.0-icu

ARG SHOUTIT_ENV

# Install Debian dependencies
RUN apt-get update && apt-get install -y \
    htop \
    vim \
 && rm -rf /var/lib/apt/lists/*

# Install proeject dependencies
COPY package.json /tmp/package.json
RUN cd /tmp && npm install --production

# Install global dependencies [PM2]
RUN npm install --global pm2@2.6.1

# Define working directory
RUN mkdir /src && cp -a /tmp/node_modules /src
WORKDIR /src
COPY . /src

EXPOSE 8080

ENV NODE_ENV production
ENV PORT 8080
ENV SHOUTIT_ENV=$SHOUTIT_ENV

CMD ['pm2-docker', 'process.yml']
