'use strict';

var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var git = require('gulp-git');
var header = require('gulp-header');
var pug = require('gulp-pug');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');
var decomment = require('gulp-decomment');
var eslint = require('gulp-eslint');

var browserSync = require('browser-sync').create();
var del = require('del');
var runSequence = require('run-sequence');
var pkg = require('./package.json');
var config = require('./config.json');

var banner = [
	'/*',
	' *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>',
	' *  <%= pkg.description %>',
	' *  <%= pkg.homepage %>',
	' *',
	' *  <%= pkg.author.name %>',
	' *  Under <%= pkg.license %> License',
	' */',
	''
].join('\n');

// commit message
var ghpCommit = 'update demo ' + new Date().toLocaleString('en-US');

// set gulpfile.js changed
gulp.slurped = false;

gulp.task('clean', del.bind(null, [config.dir.tmp]));

gulp.task('sass', function () {
	return gulp.src([config.src.scss, config.demo.scss])
		.pipe(sass({
			outputStyle: 'expanded'
		}).on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(gulp.dest(config.dir.tmp))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('pug', function () {
	return gulp.src(config.demo.pug)
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest(config.dir.tmp));
});

gulp.task('lint', function () {
	return gulp.src(config.src.js)
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

gulp.task('serve', function () {
	if (!gulp.slurped) {
		browserSync.init({
			notify: false,
			ui: false,
			server: {
				baseDir: ['.tmp', 'src'],
				routes: {
					'/bower_components': 'bower_components'
				}
			}
		});

		gulp.watch(config.src.js, ['lint']);
		gulp.watch([config.src.scss, config.demo.scss], ['sass']);
		gulp.watch(config.demo.pug, ['pug']);
		gulp.watch(config.tmp.html).on('change', browserSync.reload);
		gulp.watch('gulpfile.js', ['dev']);
		gulp.slurped = true;
	}
});

gulp.task('html', function () {
	return gulp.src(config.tmp.html)
		.pipe(useref({
			searchPath: 'dist'
		}))
		.pipe(gulp.dest(config.dir.tmp));
});

gulp.task('dist-js', function () {
	return gulp.src(config.src.js)
		.pipe(stripDebug())
		.pipe(decomment({
			trim: true
		}))
		.pipe(header(banner, { pkg: pkg }))
		.pipe(gulp.dest(config.dir.dist))

		.pipe(uglify())
		.pipe(header(banner, { pkg: pkg }))
		.pipe(rename({
			extname: '.min.js'
		}))
		.pipe(gulp.dest(config.dir.dist));
});

gulp.task('dist-css', function () {
	return gulp.src(config.src.scss)
		.pipe(sass({
			outputStyle: 'expanded'
		}).on('error', sass.logError))
		.pipe(header(banner, { pkg: pkg }))
		.pipe(gulp.dest(config.dir.dist))

		.pipe(sass({
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(header(banner, { pkg: pkg }))
		.pipe(rename({
			extname: '.min.css'
		}))
		.pipe(gulp.dest(config.dir.dist));
});

// for development
gulp.task('dev', ['clean'], function () {
	runSequence(['sass', 'pug'], 'serve');
});

// for build dist
gulp.task('dist', function () {
	runSequence('lint', ['dist-js', 'dist-css']);
});

// for github pages plugin
gulp.task('demo', ['clean'], function () {
	runSequence('dist', ['sass', 'pug'], 'html');
});

