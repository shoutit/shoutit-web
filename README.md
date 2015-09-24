# Shoutit Webserver

## Stack
* nodejs
	* express
	* jade
	* react
* redis

## Installation
* install globalDependencies listed in `package.json`
* add or export `NODE_PATH=GLOBAL_NODE_MODULES_DIR` to your environment
* clone this repo
* cd into work copy
* install node dependencies using `npm install`
* start development server via `gulp`

## Basic concept: Isomorphic WebApp
* Rendering on client and server
	* Server renders the initial page for the desired route
	* Client takes the rendering over after loading the initial page in the browser
	* Advantages:
		* Pages can be crawled by Google etc (SEO)
		* Less load on the server due to client side rendering
* Webserver as oAuth-Client
	* The server acts as a oAuth-Client to the backend server like the android and ios app.
	* Sessions and Cookies are used for the browser authentication.
		* Session-oAuth-Token-Mapping is saved via a redis db on the webserver machine.


## Server Setup (for ubuntu/debian)
1. Build and install NodeJS from Source
    1. `mkdir ~/sources && cd ~/sources`
    2. `wget http://nodejs.org/dist/v0.12.0/node-v0.12.0.tar.gz`
    3. `tar xzf node-v0.12.0.tar.gz && cd node-v0.12.0`
    4. `./configure && make`
    5. `make install`
    6. Test installation with `node -v` and `npm -v`

2. Build and install NGINX from Source
	1. `cd ~/sources`
	2. `wget http://nginx.org/download/nginx-1.6.2.tar.gz`
	3. `tar xzf nginx-1.6.2.tar.gz && cd nginx-1.6.2`
	4. `./configure --prefix=/etc/nginx/
					--sbin-path=/usr/sbin/nginx
					--conf-path=/etc/nginx/nginx.conf
					--pid-path=/var/run/nginx.pid
					--error-log-path=/var/log/nginx/error.log
					--http-log-path=/var/log/nginx/access.log
					--with-http_ssl_module
					--with-http_spdy_module`
	5. `make && make install`
	6. Create init script:
		1. `sudo nano /etc/init.d/nginx`
		2. Copy from below.
		3. Make it executable: `sudo chmod +x /etc/init.d/nginx`
        4. Test it `/etc/init.d/nginx start`

3. Build and install Redis from Source
	1. `apt-get install tcl8.5`
	2. `wget http://download.redis.io/releases/redis-2.8.19.tar.gz`
	3. `tar xzf redis-2.8.19.tar.gz && cd redis-2.8.19/`
	4. `make && make install`
	5. `cd utils && ./install_server.sh`
	6. Test it: `redis-cli PING`
	7. Improve performance: `nano /etc/sysctl.conf` and add `vm.overcommit_memory = 1`

4. Install PM2 process Manager using npm
	1. `npm install -g pm2`
	2. `pm2 list`
	3. `pm2 startup ubuntu`

5. Configure NGINX Static File Server and Backend upstream
	1. `nano /etc/nginx/nginx.conf` see config file below

6. Create nginx user and deployment folder (/var/www/)
	1. 

7. Configure PM2
	1. `



### nginx init script (/etc/init.d/nginx)

	#! /bin/sh

	### BEGIN INIT INFO
	# Provides:          nginx
	# Required-Start:    $all
	# Required-Stop:     $all
	# Default-Start:     2 3 4 5
	# Default-Stop:      0 1 6
	# Short-Description: starts the nginx web server
	# Description:       starts nginx using start-stop-daemon
	### END INIT INFO

	PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
	DAEMON=/usr/sbin/nginx
	NAME=nginx
	DESC=nginx

	test -x $DAEMON || exit 0

	# Include nginx defaults if available
	if [ -f /etc/default/nginx ] ; then
		. /etc/default/nginx
	fi

	set -e

	. /lib/lsb/init-functions

	case "$1" in
	  start)
		echo -n "Starting $DESC: "
		start-stop-daemon --start --quiet --pidfile /var/run/$NAME.pid \
			--exec $DAEMON -- $DAEMON_OPTS || true
		echo "$NAME."
		;;
	  stop)
		echo -n "Stopping $DESC: "
		start-stop-daemon --stop --quiet --pidfile /var/run/$NAME.pid \
			--exec $DAEMON || true
		echo "$NAME."
		;;
	  restart|force-reload)
		echo -n "Restarting $DESC: "
		start-stop-daemon --stop --quiet --pidfile \
			/var/run/$NAME.pid --exec $DAEMON || true
		sleep 1
		start-stop-daemon --start --quiet --pidfile \
			/var/run/$NAME.pid --exec $DAEMON -- $DAEMON_OPTS || true
		echo "$NAME."
		;;
	  reload)
		  echo -n "Reloading $DESC configuration: "
		  start-stop-daemon --stop --signal HUP --quiet --pidfile /var/run/$NAME.pid \
			  --exec $DAEMON || true
		  echo "$NAME."
		  ;;
	  status)
		  status_of_proc -p /var/run/$NAME.pid "$DAEMON" nginx && exit 0 || exit $?
		  ;;
	  *)
		N=/etc/init.d/$NAME
		echo "Usage: $N {start|stop|restart|reload|force-reload|status}" >&2
		exit 1
		;;
	esac

	exit 0


### NGINX server config (/etc/nginx/nginx.conf)

	user nginx;
	worker_processes  1;

	events {
		worker_connections  1024;
	}

	http {
		include       mime.types;
		default_type  application/octet-stream;

		sendfile        on;

		keepalive_timeout  65;

		gzip  on;

		server {
		   listen         80;
		   server_name    web.shoutit.com;
		   root /var/www/shoutit-web/app/public;


		   location @webserver {
			  proxy_pass       http://localhost:8080;
			  proxy_set_header Host      $host;
			  proxy_set_header X-Real-IP $remote_addr;
		   }

		   location / {
			  expires 30m;
			  try_files $uri @webserver;
		   }

		}
	}

### PM2 Process Config JSON (/var/www/shoutit-web.json)

	{
      "apps" : [{
        "name": "shoutit-web",
        "script": "/var/www/shoutit-web/app.js",
        "port": 8080,
        "env": {
          "API_URL": "http://<internal-api-ip>:/api/v2/"
        }
      }]
    }



