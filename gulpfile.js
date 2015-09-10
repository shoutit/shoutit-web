/**
 * Created by Philip on 12.01.2015.
 */

"use strict";

var path = require('path'),
	gulp = require('gulp'),
	nodemon = require('gulp-nodemon'),
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
			'NODE_ENV': 'developmentLocal',
			'API_URL': process.env.API_URL || 'http://dev.api.shoutit.com/v2/',
			'REDIS_HOST': process.env.REDIS_HOST || 'localhost'
		}
	});
});


var sassTask = "sass",
	sassDir = path.join(__dirname, "/app/res/sass/"),
	sassSrc = path.join(sassDir, "main.scss"),
	sassMaps = "scss",
	cssRoot = "/css/",
	sassDest = path.join(publicDir, cssRoot);

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
		.pipe(sourcemaps.write(sassMaps, {
			sourceMappingURLPrefix: cssRoot
		}))
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

var iconMinTask = "sass-icon-min";
gulp.task(iconMinTask, function () {
	return gulp.src(imageDest + "/icons-*")
		.pipe(imagemin())
		.pipe(gulp.dest(imageDest));
});

gulp.task("build", [imageTask, sassTask, iconMinTask]);

gulp.task("watch", ["build"], function () {
	livereload.listen();
	gulp.watch([sassDir + "**/*.scss"], [sassTask]);
});

gulp.task("default", ["watch", devServerTask]);
