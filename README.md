# Shoutit web app

## Setup

* Make sure to have node.js 4+ installed with `node --version`.

```bash
git clone git@github.com:shoutit/shoutit-web.git
cd shoutit-web
npm install
```

## Running the app

The app must be built before starting:

```bash
npm run build # build the app
npm start     # start server
```

then open [http://localhost:8080](http://localhost:8080).

### Environment variables

The following variables define the configuration used to build and run the app.

* `NODE_ENV`: can be `production` or `development`.
* `HOST`: the host where to start the Express server. Default is `localhost`.
* `PORT`: the port the server listens to. Default is `8080` for production, `3000` for development.
* `SHOUTIT_API_URL`: the url for the REST API. Default is http://dev.api.shoutit.com/v2/
* `SHOUTIT_ASSETS_URL`: the url where the assets are stored (can be a CDN url, such as http://s3.amazon.com/shoutit/stage). Default is empty (assets are served by node).
* `BASIC_AUTH_USERNAME` and `BASIC_AUTH_PASSWORD`: username and password to enforce a basic authentication access control
* `REDIS_HOST`: the host for the redis server, default is `localhost`
* `BROWSER`: used by our code to *require* modules only from the browser:

```js
if (process.env.BROWSER) {
	require("styles/mystyle.scss");
}
```

### Starting the docker container

```bash
# Pull the container from Docker Hub
docker pull shoutit/shoutit-web:develop

# Run the container
docker run -e SHOUTIT_ASSETS_URL=http://localhost:8080 -e PORT=8080 -p 8080:8080 -it shoutit/shoutit-web:develop
```

Then open [http://localhost:8080](http://localhost:8080).

**On OS X** you should use the docker machine ip instead of `localhost`, e.g.:

```
# Run the container
docker run -e SHOUTIT_ASSETS_URL=http://192.168.99.100:8080 -e PORT=8080 -p 8080:8080 -it shoutit/shoutit-web:develop
```

and then open [http://192.168.99.100:8080](http://192.168.99.100:8080).

To get the IP of the docker machine, run `docker-machine ip`.

## Development

Start the development environment to enable hot modules reload:

```bash
npm run dev
```

then open  [http://localhost:3000](http://localhost:3000)

### Tests

Unit tests run with [mocha](http://mochajs.org) and [chai](http://chaijs.com):

```bash
npm test
npm run test:watch    # Watch mode
```

Test coverage with [istanbul](https://github.com/gotwarlost/istanbul):

```bash
npm run test:cover
```

then open [coverage/lcov-report/index.html](coverage/lcov-report/index.html).
