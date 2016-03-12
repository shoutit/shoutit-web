# Shoutit web app

[![Code Climate](https://codeclimate.com/repos/56c5b6fcc2ad1f39dc002b07/badges/1b41af543e8e6c516c95/gpa.svg)](https://codeclimate.com/repos/56c5b6fcc2ad1f39dc002b07/feed) [![Test Coverage](https://codeclimate.com/repos/56c5b6fcc2ad1f39dc002b07/badges/1b41af543e8e6c516c95/coverage.svg)](https://codeclimate.com/repos/56c5b6fcc2ad1f39dc002b07/coverage)

## Setup

Make sure to have node.js 4+ installed with `node --version`.

```bash
git clone git@github.com:shoutit/shoutit-web.git
cd shoutit-web
npm install
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

```bash
# Pull the container from Docker Hub
$ docker pull shoutit/shoutit-web:develop

# Run the container
$ docker run -e PORT=8080 -p 8080:8080 -it shoutit/shoutit-web:develop
```

Then open [http://localhost:8080](http://localhost:8080).

**On OS X** you should use the docker machine ip instead of `localhost`, e.g.:

```bash
# Run the container
$ docker run -e SHOUTIT_PUBLIC_URL=http://192.168.99.100:8080 -e PORT=8080 -p 8080:8080 -it shoutit/shoutit-web:develop
```

and then open [http://192.168.99.100:8080](http://192.168.99.100:8080).

To get the IP of the docker machine, run `docker-machine ip`.

### Building the docker container

Run this command from the project root:

```bash
$ docker build .
```

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

### Application structure

Files are put into directories organized by "domain", e.g.

```bash
app
├── actions    # put flux actions here
├── auth       # components used by authentication
├── chat       # components for the chat
├── client     # client-side only stuff
├── containers # containers component
├── server     # server-side only things
├── services   # fetchr services
├── shouts     # component displaying shouts
├── stores     # put your stores here
├── profiles   # component related to profiles (ex users)
├── ui         # user interface components, such buttons, icons, etc.
├── utils      # various utils
└── etc.
```

#### Components

* components' extension is _.js_ (not _.jsx_)
* component names must be CamelCase and clear in their intent.
    - example of good names: _UserAvatar_, _ShoutDetail_, _Footer_...
    - try to use html inspired names: _ReplyShoutForm_, _SocialButton_...
* component's filenames must be the same as the component's name. E.g. `<AwesomeComponent>` is exported from _AwesomeComponent.js_
* container components, i.e. route handlers imported by [routes.js](app/routes.js), must be placed into the _containers_ directory
* also each component must have a test, with extension _.test.js_ in the same folder. E.g. _MyAwesomeComponent.test.js_ (see [Tests](#tests) below)
* a component may have a style sheet, e.g. _MyAwesomeComponent.scss_, to be placed in the same folder
    - a component must import only its own .scss file: other Sass modules can be imported from that
    - to import a .scss files write
```js
if (process.env.BROWSER) {
    require("./MyAwesomeComponent.scss");
}
```

#### Flux

* Stores go into the _/store_ folder, and have _ItemsStore.js_ name
* Actions go into the _/actions_ folder, and have a _ItemsActions.js_ name
* Action types goes into a single file: _/actions/actionTypes.js_
    - this will avoid duplicating action types

### Tests

Unit tests run with [mocha](http://mochajs.org) and [chai](http://chaijs.com):

```bash
$ npm test
$ npm run test:watch    # Watch mode
$ npm run test:single <file1>[, <file2>] # Test a watch single files
```

Test coverage with [istanbul](https://github.com/gotwarlost/istanbul):

```bash
$ npm run test:cover
```

then open [coverage/lcov-report/index.html](coverage/lcov-report/index.html).

#### Writing unit tests

* Fixtures and mocks goes into _assets/fixtures_
* Instead of putting test specs into _/test_, each file must have a relative _*.test.js_ file. If test is not ready yet, just import the file, so that our test coverage script will detect it. Example:

```js
import myScript from "./myScript"; // eslint-disable-line
// no tests here, code climate will complain :(
```
