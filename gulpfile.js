/**
 *
 *  Web Starter Kit
 *  Copyright 2014 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

'use strict';
var SRC = './src';
var DEST = './build';
var faviconSrc= SRC + "/*.ico";

var imgSrc = SRC + '/images/**/*', imgDest = DEST + '/images',
jsSrc = SRC + '/scripts/**/*.js', jsxSrc = SRC + '/scripts/react/', jsDest = DEST + '/scripts',
stylesSrc = SRC + '/styles/**/*', stylesDest = DEST + '/styles', sassSrc = SRC + '/styles/**/*.scss',
htmlSrc = SRC + '/*.html', jsLibDest = DEST + '/lib', faviconSrc= SRC + "/*.ico";


// Include Gulp & tools we'll use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var pagespeed = require('psi');
var path = require('path');
var mainBowerFiles = require('main-bower-files');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var gulpFilter = require('gulp-filter');
var less = require('gulp-less');
var sass = require('gulp-sass');
var gutil = require('gulp-util');


//delay of server start time
var SERVE_DELAY = 3000;

var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

// Lint JavaScript
gulp.task('jshint', function () {
  return gulp.src('src/scripts/**/*.js')
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('js', function () {
  return gulp.src('src/scripts/**/*')
    .pipe($.if('*.js', $.uglify({preserveComments: 'some'})))
    .pipe(gulp.dest('build/scripts'))
    .pipe($.size({title: 'scripts'}));
});

// Optimize images
gulp.task('images', function () {
  console.log('Images');
  return gulp.src('src/images/**/*')
    //.pipe($.cache($.imagemin({
    //  progressive: true,
    //  interlaced: true
    //})))
    .pipe(gulp.dest('build/images'))
    .pipe($.size({title: 'images'}));
});

//move favicon
gulp.task('favicon', function(){
	gulp.src(faviconSrc)
	.pipe(changed(DEST))
	.pipe(gulp.dest(DEST));
});


// Copy all files at the root level (src)
gulp.task('copy', ['styles', 'images', 'js', 'bower', 'html'], function () {
  return gulp.src([
    'src/**/*',
    '!src/images/**/*',
    '!src/scripts/**/*',
    '!src/**/*.scss',
    '!src/*.html',
    'node_modules/apache-server-configs/dist/.htaccess'
  ], {
    dot: true
  }).pipe(gulp.dest('build'))
    .pipe($.size({title: 'copy'}));
});


// Copy all files at the root level (src)
gulp.task('copy:clean', function (cb) {
  runSequence('clean', 'copy', cb);
});

// Copy web fonts to dist
gulp.task('fonts', function () {
  return gulp.src(['src/fonts/**'])
    .pipe(gulp.dest('build/fonts'))
    .pipe($.size({title: 'fonts'}));
});

// Compile and automatically prefix stylesheets
gulp.task('styles', function () {
  // For best performance, don't add Sass partials to `gulp.src`
	console.log($);
  return gulp.src([
                   'src/styles/**/*.scss'
  ], {dot: true})
    .pipe($.sourcemaps.init())
    //.pipe($.changed('.tmp/styles', {extension: '.css'}))
    .pipe($.sass({
      precision: 10,
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    .pipe($.sourcemaps.write())
    //.pipe(gulp.dest('.tmp/styles'))
    // Concatenate and minify styles
    .pipe($.if('*.css', $.csso()))
    .pipe(gulp.dest('build/styles'))
    .pipe($.size({title: 'styles'}));
});

//move bower components
gulp.task('bower', function(){
	  var jsFilter = gulpFilter('*.js', {restore: true});
	  var lessFilter = gulpFilter('*.less', {restore: true});
	  var sassFilter = gulpFilter('*.scss', {restore: true});
	  var cssFilter = gulpFilter('*.css', {restore: true});
	  var eotFontFilter = gulpFilter('*.eot', {restore: true});
	  var svgFontFilter = gulpFilter('*.svg', {restore: true});
	  var woffFontFilter = gulpFilter('*.woff', {restore: true});
	  var ttfFontFilter = gulpFilter('*.ttf', {restore: true});
	  var woff2FontFilter = gulpFilter('*.woff2', {restore: true});
	  var imageFilter = gulpFilter(['*.png', 'jpg', 'jpeg'], {restore: true});

	  var onError = function (err) {
	    console.log(err);
	   };

		return gulp.src(mainBowerFiles())
	  // grab vendor js files from bower_components and push in /build/
	  .pipe(jsFilter)
	  .pipe(gulp.dest(jsLibDest + '/js/').on('error', function(){console.log(arguments)}))
		.pipe(jsFilter.restore)
	  //less
	  .pipe(lessFilter)
	  .pipe(less({
	      paths: [ path.join(__dirname, 'less', 'includes') ]
	    }))
	  .pipe(gulp.dest(jsLibDest + '/css/').on('error', function(){console.log(arguments)}))
		.pipe(lessFilter.restore)
	  //sass
	  .pipe(sassFilter)
	  .pipe(sass().on('error', sass.logError))
	  .pipe(gulp.dest(jsLibDest + '/css/'))
		.pipe(sassFilter.restore)
	  // grab vendor css files from bower_components and push in /build/
	  .pipe(cssFilter)
	  .on('error', gutil.log.bind(gutil, 'Browserify Error'))
	  .pipe(gulp.dest(jsLibDest + '/css/'))
	  .pipe(cssFilter.restore)
	  // grab vendor font files from bower_components and push in /build/
	  .pipe(eotFontFilter)
	  .pipe(gulp.dest(jsLibDest + '/fonts'))
	  .pipe(eotFontFilter.restore)
	  .pipe(svgFontFilter)
	  .pipe(gulp.dest(jsLibDest + '/fonts'))
	  .pipe(svgFontFilter.restore)
	  .pipe(woffFontFilter)
	  .pipe(gulp.dest(jsLibDest + '/fonts'))
	  .pipe(woffFontFilter.restore)
	  .pipe(ttfFontFilter)
	  .pipe(gulp.dest(jsLibDest + '/fonts'))
	  .pipe(ttfFontFilter.restore)
	  .pipe(woff2FontFilter)
	  .pipe(gulp.dest(jsLibDest + '/fonts'));
	});

// Scan your HTML for assets & optimize them
gulp.task('html', function () {
  //var assets = $.useref.assets({searchPath: '{src}'});

  return gulp.src('src/**/*.html')
    //.pipe(assets)
    // Concatenate and minify JavaScript
    //.pipe($.if('*.js', $.uglify({preserveComments: 'some'})))
    // Remove any unused CSS
    // Note: if not using the Style Guide, you can delete it from
    //       the next line to only include styles your project uses.
    //.pipe($.if('*.css', $.uncss({
    //  html: [
    //    'src/index.html'
    //  ],
    //  // CSS Selectors for UnCSS to ignore
    //  ignore: [
    //    /.navdrawer-container.open/,
    //    /.app-bar.open/
    //  ]
    //})))
    // Concatenate and minify styles
    // In case you are still using useref build blocks
    //.pipe($.if('*.css', $.csso()))
    //.pipe(assets.restore())
    //.pipe($.useref())
    // Update production Style Guide paths
    //.pipe($.replace('components/components.css', 'components/main.min.css'))
    // Minify any HTML
    .pipe($.if('*.html', $.minifyHtml({comments:true, conditionals: true, loose: true})))
    // Output files
    .pipe(gulp.dest('build'))
    .pipe($.size({title: 'html'}));
});

// Clean output directory
gulp.task('clean', del.bind(null, ['src/lib/*', 'build/*', '!build/.git'], {dot: true}));


// Serve output from the build
gulp.task('serve', ['copy:clean'], function () {
  browserSync.init({
        notify: false,
        logLevel: "debug", //silent,info
        logPrefix: 'WebComm',
        // Run as an https by uncommenting 'https: true'
        // Note: this uses an unsigned certificate which on first access
        //       will present a certificate warning in the browser.
        // https: true,
        server: 'build',
        realodDelay:0, //default value,
        // Wait 2 seconds after a reload event before allowing more.
        reloadDebounce: 2000
        //, Plugin Specification
        // First run `npm install bs-html-injector`
        // Then provide the module name
        //plugins: ["bs-html-injector"],

        // If the plugin you are using requires options
        // just as bs-snippet-injector requires a 'file' option,
        // you can pass an object instead like this.
        //plugins: [
        //  {
        //    module: "bs-snippet-injector",
        //    options: {
        //      file: "./app/index.php"
        //    }
        //  }
        //]
      });
});


//launch browser and refresh for changes made
gulp.task('serve:watch',  function(cb) {
  runSequence('serve', 'watch', cb);
});

gulp.task('watch', function () {
  gulp.watch(['src/**/*.html'], ['html', reload]);
  gulp.watch(['src/styles/**/*.{scss,css}'], ['styles', reload]);
  gulp.watch(['src/scripts/**/*.js'], ['jshint', 'js', reload]);
  gulp.watch(['src/images/**/*'], ['images', reload]);
  gulp.watch(['src/lib/**/*'], ['copy', reload]);
});

// Watch files for changes & reload
//gulp.task('serve', ['styles', 'bower'], function () {
//  browserSync({
  //  notify: false,
    // Customize the BrowserSync console logging prefix
//    logPrefix: 'WSK',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
  //  server: ['.tmp', 'src']
//  });

//  gulp.watch(['src/**/*.html'], reload);
//  gulp.watch(['src/styles/**/*.{scss,css}'], ['styles', reload]);
//  gulp.watch(['src/scripts/**/*.js'], ['jshint']);
//  gulp.watch(['src/images/**/*'], reload);
//});


// Build production files, the default task
gulp.task('default', ['clean'], function (cb) {
  runSequence('jshint', 'copy', cb);
});

// Run PageSpeed Insights
gulp.task('pagespeed', function (cb) {
  // Update the below URL to the public URL of your site
  pagespeed.output('example.com', {
    strategy: 'mobile',
    // By default we use the PageSpeed Insights free (no API key) tier.
    // Use a Google Developer API key if you have one: http://goo.gl/RkN0vE
    // key: 'YOUR_API_KEY'
  }, cb);
});

// Load custom tasks from the `tasks` directory
// try { require('require-dir')('tasks'); } catch (err) { console.error(err); }
