# Shoutit web app

[![Code Climate](https://codeclimate.com/repos/56c5b6fcc2ad1f39dc002b07/badges/1b41af543e8e6c516c95/gpa.svg)](https://codeclimate.com/repos/56c5b6fcc2ad1f39dc002b07/feed) [![Test Coverage](https://codeclimate.com/repos/56c5b6fcc2ad1f39dc002b07/badges/1b41af543e8e6c516c95/coverage.svg)](https://codeclimate.com/repos/56c5b6fcc2ad1f39dc002b07/coverage)

## Setup

1. Make sure to have node.js 4+ installed with `node --version`.

```bash
$ git clone git@github.com:shoutit/shoutit-web.git
$ cd shoutit-web
$ npm install
```

2. Install and run a redis server to enable authentication

```
$ brew install redis
$ redis-server # Run redis in background
```

## Running the app

The app must be built before starting:

```bash
$ npm run build # build the app
$ npm start     # start the server
```

### Environment variables

|variable|description|default|
|---|---|---|
|`SHOUTIT_ENV` |Load a preset of configuration settings from the relative [env](env). Possible values are `development`, `stage`, `beta` or `live`.|`development`|
|`NODE_ENV`|Either `production` or `development`|`development`|
|`HOST`|The server's host name.|`localhost`|
|`PORT`|The server's port|`3000`|
|`REDIS_HOST`|The host for the redis server|`tcp://localhost:6379`
|`SHOUTIT_S3_SECRET_KEY`|Required to upload data to S3||
|`SHOUTIT_S3_ACCESS_KEY`|Required to upload data to S3||
|`BASIC_AUTH_USERNAME`|Enable basic HTTP auth||
|`BASIC_AUTH_PASSWORD`|Enable basic HTTP auth||
|`SENTRY_DSN`|Enable basic HTTP auth||
|`NEW_RELIC_LICENSE_KEY`|The New Relic application license key||
|`NEW_RELIC_APP_NAME`|The New Relic application name||
|`CURRENT_TAG`| the current git versioning info. Default is set in index.js.||

### Starting the docker container

#### Pulling the container from Docker Hub

```bash
# Pull the container from Docker Hub
$ docker pull shoutit/shoutit-web:develop

# Run the container
$ docker run -e PORT=8080 -p 8080:8080 -it shoutit/shoutit-web:develop
```

Then open [http://localhost:8080](http://localhost:8080).

#### Using the container from the current machine

```bash
# Build the container
$ docker build .

# Run the container
$ docker run -e PORT=8080 -p 8080:8080 <ContainerID>
```

#### On OS X

On **OS X**, use the docker machine IP instead of `localhost`: to get the IP of the docker machine, run `docker-machine ip`.

Example:

```bash
# Run the container
$ docker run -e HOST=http://192.168.99.100:8080 -e PORT=8080 -p 8080:8080 -it shoutit/shoutit-web:develop
```

and then open [http://192.168.99.100:8080](http://192.168.99.100:8080).

## Building

To build the app run

```bash
$ npm run build
```

The script will build the app with webpack and output into the [public](public) folder.

* After the build, this directory will contain `scripts`, `images` and `styles` folders
* Non built images are copied from [assets/images](assets/images)
* Copy the content of this directory to the CDN and set the `SHOUTIT_PUBLIC_URL` to serve from it.
* It is served by node.js in case `SHOUTIT_PUBLIC_URL` is not set.

### To test the built app

```
$ PORT=8080 npm run dev:built
```

and open [http://localhost:8080](http://localhost:8080).

## Development

Start the development environment to enable hot modules reload:

```bash
$ npm run dev
```

then open  [http://localhost:3000](http://localhost:3000).

If you want to test the client of another computer in the same network, use the `HOST` env variable:

```bash
$ HOST=$HOSTNAME npm run dev # Tested only on OSX
```

### Updating dependencies

* Dependencies are shrinkwrapped: run `npm shrinkwrap` when updating the production dependencies.

* Dependencies must be included in the [vendors bundle](assets/scripts/vendors.js).
  * add or remove the dependency from the vendor bundle in [assets/vendor-packages.js](assets/vendor-packages.js).
  * run `npm run build:vendors:dev` to update the vendors bundle.

### i18n

When adding a new translation messages in our code (e.g. using `<FormattedMessage`>), the Babel compiler extracts automatically the default messages and places them into the [assets/intl/messages](https://github.com/shoutit/shoutit-web/tree/develop/assets/intl/messages/app) directory. 

To make the default messages translatable, they must be saved into the locale-relative JSON files in   [assets/intl/translations](https://github.com/shoutit/shoutit-web/tree/develop/assets/intl/translations).

Run this script to updated those JSONs:

```bash
$ npm run build:translations
```

The localized JSONs *must* be committed on the `develop` branch to make them available to the translators.

### Tests

Most of the unit tests run with [mocha](http://mochajs.org), [chai](http://chaijs.com) and [enzyme](https://github.com/airbnb/enzyme).
Some specs that need a browser instance run with [karma](https://karma-runner.github.io).

```bash
$ npm test            # run all the tests

$ npm test:mocha      # run all the mocha tests
$ npm run test:watch  # watch mode for mocha tests
$ npm run test:single <file1>[, <file2>] # Test and watch single files with mocha

$ npm test:karma           # run all the karma specs
$ npm run test:karma:watch # watch mode for karma specs

```

Test coverage with [istanbul](https://github.com/gotwarlost/istanbul):

```bash
$ npm run test:cover        # coverage for the mocha tests
$ npm run test:mocha:cover  # coverage for the karma specs
```

Test coverage output is in the _coverage_ directory.

#### Writing unit tests

* Fixtures and mocks goes into _assets/fixtures_
* Each file must have a relative _*.test.js_  (for mocha tests) or _*.spec.js_ (for karma) file

### Deploy

* pushing to the `develop` branch will deploy to [stage.www.shoutit.com](http://stage.www.shoutit.com)
* pushing to the `master` branch will deploy to [beta.www.shoutit.com](http://beta.www.shoutit.com) (login/password: `beta`/`beta`)
* creating a new tag `release-<n>` (e.g. `release-24`) on the `master` branch will release the tag to [www.shoutit.com](http://www.shoutit.com). Releases should be tracked on github's [releases page](https://github.com/shoutit/shoutit-web/releases).
