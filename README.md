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

#### Required on the server

* `SHOUTIT_ENV`: define if use stage, beta or live [config](config).
* `SHOUTIT_S3_SECRET_KEY` and `SHOUTIT_S3_ACCESS_KEY`: required for uploading on S3
* `REDIS_HOST`: the host for the redis server, default is *localhost*
* `NODE_ENV`: must be set on *production*

#### Optional on the server

* `NEW_RELIC_LICENSE_KEY` and `NEW_RELIC_APP_NAME`: the New Relic application name
* `BASIC_AUTH_USERNAME` and `BASIC_AUTH_PASSWORD`: username and password to enforce a basic authentication access control
* `HOST`: the host where to start the Express server. Default is *localhost*.
* `PORT`: the port the server listens to. Default is *8080* for production, *3000* for development.

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

### Tests

Most of the unit tests run with [mocha](http://mochajs.org) and [chai](http://chaijs.com).
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
* If test is not ready yet, just import the file, so that our test coverage script will detect it. Example:

```js
import myScript from "./myScript"; // eslint-disable-line
// no tests here, code climate will complain :(
```
