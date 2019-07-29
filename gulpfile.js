"use strict";
const config = require('./config.json');

const gulp = require('gulp');
const gutil = require('gulp-util');
const merge = require('merge2');
const streamify = require('gulp-streamify');

const source = require('vinyl-source-stream');
const nodemon = require('gulp-nodemon');

const sass = require('gulp-sass');
const htmlmin = require('gulp-htmlmin');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');

const yargs = require('yargs');
const argv = yargs.argv;

const browserSync = require('browser-sync')

const isProduction = argv.production;

if(isProduction) {
	process.env.NODE_ENV = 'production';
}

const SRC_DIR = './src';
const BUILD_DIR = './build';

function swallowError (error) {
	console.log(error.toString());
	this.emit('end');
}

function buildHtml() {
	let buildStartTime = null;
	let buildEndTime = null;

	function run() {
		buildStartTime = new Date();

		let stream = gulp.src(`${SRC_DIR}/html/index.html`)
		.on('error', swallowError)
		.on('end', () => {
			buildEndTime = new Date();
			gutil.log(`Building HTML done. (Time elapsed ${buildEndTime - buildStartTime}ms.)`);
		})

		if(isProduction) {
			stream.pipe(htmlmin({collapseWhitespace: true}));
		}

		return stream.pipe(gulp.dest(`${BUILD_DIR}/html`));
	} 

	if(!argv.once) {
		gulp.watch(`${SRC_DIR}/html/**`, () => {
			gutil.log('Detect HTML changes. Rebuilding...');
			return run();
		});
	}

	return run();
}

function buildScss() {
	let buildStartTime = null;
	let buildEndTime = null;

	function run() {
		buildStartTime = new Date();

		let stream = gulp.src(`${SRC_DIR}/scss/app.scss`)
		.on('error', swallowError)
		.on('end', () => {
			buildEndTime = new Date();
			gutil.log(`Building SCSS done. (Time elapsed ${buildEndTime - buildStartTime}ms.)`);
		})
		.pipe(
			sass()
			.on('error', sass.logError)
		);

		if(isProduction) {
			stream.pipe(cleanCSS());
		}

		return stream.pipe(gulp.dest(`${BUILD_DIR}/css`))
		.pipe(browserSync.stream());
	} 

	if(!argv.once) {
		gulp.watch(`${SRC_DIR}/scss/**`, () => {
			gutil.log('Detect SCSS changes. Rebuilding...');
			return run();
		});
	}

	return run();
}

function buildJs() {
  let buildStartTime = null;
  let buildEndTime = null;
  
  function run() {
		buildStartTime = new Date();

		let stream = gulp.src(`${SRC_DIR}/js/index.js`)
		.on('error', swallowError)
		.on('end', () => {
			buildEndTime = new Date();
			gutil.log(`Building JS done. (Time elapsed ${buildEndTime - buildStartTime}ms.)`);
		});

		if(isProduction) {
			stream.pipe(uglify());
		}

		return stream.pipe(gulp.dest(`${BUILD_DIR}/js`))
		.pipe(browserSync.stream());
	} 

	if(!argv.once) {
		gulp.watch(`${SRC_DIR}/js/**`, () => {
			gutil.log('Detect JS changes. Rebuilding...');
			return run();
		});
	}

	return run();
}

function serve(done) {
	let serverStarted = false;

	nodemon({ 
		script: 'server.js',
		ignore: ['src/**', 'build/**']
	})
	.on('start', () => {
		if(!serverStarted) {
			serverStarted = true;

			browserSync.init(null, {
				proxy: `localhost:${config.port || 3000}`,
				port: config.proxyPort || 4000
			});

			gulp.watch(`${SRC_DIR}/html/**`, buildHtml);
			gulp.watch(`${SRC_DIR}/scss/**`, buildScss);

			gulp.watch(`${BUILD_DIR}/html/index.html`).on('change', browserSync.reload);

			// return empty stream
			return gutil.noop();	
		}
  })
  .on('exit', () => done());
}

gulp.task('build', () => {
	return merge([
		buildHtml(),
		buildScss(),
		buildJs()
	]);
});

gulp.task('build:html', () => {
	return buildHtml();
});

gulp.task('build:scss', () => {
	return buildScss();
});

gulp.task('build:js', () => {
	return buildJs();
});

gulp.task('serve', (done) => {
	return serve(done);
});

gulp.task('default', gulp.series(['build', 'serve']), done => {
  done();
});