/**
 * Created by Philip on 12.01.2015.
 */

"use strict";

var path = require('path'),
	gulp = require('gulp'),
	nodemon = require('gulp-nodemon'),
	source = require('vinyl-source-stream'),
	sourcemaps = require('gulp-sourcemaps'),
	livereload = require('gulp-livereload'),
	sass = require('gulp-ruby-sass'),
	imagemin = require('gulp-imagemin'),
	minifyCSS = require('gulp-minify-css');

// JSX Transpiler
require('node-jsx').install({extension: '.jsx'});

var publicDir = path.join(__dirname, '/app/public');

var devServerTask = "serve",
	devServerPort = 8080,
	serverScript = "app.js";

gulp.task(devServerTask, function () {
	nodemon({
		script: serverScript,
		port: devServerPort,
		watch: "app/server",
		ext: 'js',
		env: {
			'NODE_ENV': 'development'
		}
	});
});


var sassTask = "sass",
	sassDir = path.join(__dirname, "/app/res/sass/"),
	sassSrc = path.join(sassDir,"main.scss"),
	sassMaps = "../scss",
	sassDest = path.join(publicDir, "/css");

gulp.task(sassTask, function () {
	return sass(sassSrc, {
		sourcemap: true,
		compass: true,
		noCache: true
	})
		.on('error', function (err) {
			console.error('Error', err.message);
		})
		.pipe(minifyCSS({
			rebase: false,
			keepSpecialComments: 0
		}))
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

gulp.task("build", [imageTask, sassTask]);

gulp.task("watch", ["build"], function () {
	livereload.listen();
	gulp.watch([sassDir + "**/*.scss"], [sassTask]);
});

gulp.task("default", ["watch", devServerTask]);