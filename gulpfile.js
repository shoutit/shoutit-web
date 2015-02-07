/**
 * Created by Philip on 12.01.2015.
 */

"use strict";

var gulp = require('gulp'),
	nodemon = require('gulp-nodemon'),
	browserify = require('browserify'),
	reactify = require('reactify'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify');


var publicDir = './public';

var devServerTask = "serve",
	devServerPort = 8080,
	serverScript = "app.js";

gulp.task(devServerTask, function () {
	nodemon({
		script: serverScript,
		port: devServerPort,
		ext: 'js jsx',
		env: {
			'NODE_ENV': 'development'
		},
		ignore: ["./node_modules/**"]
		//nodeArgs: ['--debug']
	});
});

var bundleTask = "bundle",
	bundleSrc = "./app/main.js",
	bundleDest = publicDir;

gulp.task(bundleTask, function () {
	var bundler = browserify({
		entries: [bundleSrc],
		debug: true
	}).transform(reactify);

	var bundle = function () {
		return bundler
			.bundle()
			.pipe(source('main.js'))
			.pipe(buffer())
			.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(uglify())
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest(bundleDest));
			//.pipe(livereload());
	};

	return bundle();
});