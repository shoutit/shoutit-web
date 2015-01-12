# ShoutIt Webserver

## Stack
* nodejs
	* express
	* jade
	* react
* redis

## Installation
* clone this repo
* cd into work copy
* install node dependencies using `npm install`
* build client bundle via `gulp bundle`
* start development server via `gulp serve`

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