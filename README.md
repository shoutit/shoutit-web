# Shoutit web app

## Setup

* Make sure to have node.js 4+ installed with `node --version`.

```
git clone git@github.com:shoutit/shoutit-web.git
cd shoutit-web
npm install
```

## Run the app

The app must be built before starting:

```
npm run build # build the app
npm start     # start server
```

then open [http://localhost:8080](http://localhost:8080).

## Start the dev environment

The dev environment is used for developing. It enables hot modules reload.

```
npm run dev
```

then open  [http://localhost:3000](http://localhost:3000)

## Environment variables

The following variables define the configuration used to build and run the app.

* `NODE_ENV`: can be `production` or `development`.
* `HOST`: the host where to start the Express server. Default is `localhost`.
* `PORT`: the port the server listens to. Default is `8080` for production, `3000` for development.
* `REDIS_HOST`: the host for the redis server, default is `localhost`
* `BROWSER`: used by our code to *require* modules only from the browser:

```js
if (process.env.BROWSER) {
	require("styles/mystyle.scss");
}
```

## Running the docker container

```
# Pull the container from Docker Hub
docker pull shoutit/shoutit-web:develop

# Run the container
docker run -e SHOUTIT_BASE_URL=http://localhost:8080 -e PORT=8080 -p 8080:8080 -it shoutit/shoutit-web:develop
```

Then open [http://localhost:8080](http://localhost:8080).

**On OS X** you should use the docker machine ip instead of `localhost`, e.g.:

```
# Run the container
docker run -e SHOUTIT_BASE_URL=http://192.168.99.100:8080 -e PORT=8080 -p 8080:8080 -it shoutit/shoutit-web:develop
```

and then open [http://192.168.99.100:8080](http://192.168.99.100:8080).

To get the IP of the docker machine, run `docker-machine ip`.
