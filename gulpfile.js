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
	uglify = require('gulp-uglify'),
	livereload = require('gulp-livereload'),
	sass = require('gulp-ruby-sass'),
	imagemin = require('gulp-imagemin');

// JSX Transpiler
require('node-jsx').install({extension: '.jsx'});

var publicDir = './app/public';

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
		watch: ["app"],
		ignore: [
			".git", ".idea", ".sass-cache", "node_modules",
			"app/client", "app/public"
		]
	});
});

var bundleTask = "bundle",
	bundlePaths = [
		"app/client/*.js",
		"app/shared/**/*.jsx",
		"app/shared/**/*.js"
	],
	bundleSrc = "./app/client/index.js",
	bundleDest = publicDir;

gulp.task(bundleTask, function () {
	var bundler = browserify({
		entries: [bundleSrc]
	}).transform(reactify);

	var bundle = function () {
		return bundler
			.bundle()
			.pipe(source('main.js'))
			.pipe(buffer())
			.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(uglify())
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest(bundleDest))
			.pipe(livereload());
	};

	return bundle();
});

var sassTask = "sass",
	sassDir = "app/res/sass/",
	sassSrc = sassDir + "main.scss",
	sassMaps = "../scss",
	sassDest = "app/public/css";

gulp.task(sassTask, function () {
	return sass(sassSrc, {
		sourcemap: true,
		compass: true,
		//style: "compressed",
		noCache: true
	})
		.on('error', function (err) {
			console.error('Error', err.message);
		})
		.pipe(sourcemaps.write(sassMaps))
		.pipe(gulp.dest(sassDest))
		.pipe(livereload());
});

var imageTask = "minImage",
	imageSrc = "app/res/img/*.png",
	imageDest = "app/public/img";

gulp.task(imageTask, function () {
	return gulp.src(imageSrc)
		.pipe(imagemin())
		.pipe(gulp.dest(imageDest));
});

gulp.task("build", [bundleTask, sassTask]);

gulp.task("watch", ["build"], function () {
	livereload.listen();
	gulp.watch(bundlePaths, [bundleTask]);
	gulp.watch([sassDir + "**/*.scss"], [sassTask]);
});

gulp.task("default", ["watch", devServerTask]);