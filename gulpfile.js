/*=====================================
=        Default Configuration        =
=====================================*/

// Please use config.js to override these selectively:

var config = {
    project: 'demo',
    cordova: false,
    minify_images: true,

    vendor: {
        js: [
          './bower_components/jquery/dist/jquery.js',
          './bower_components/jquery-ui/ui/jquery-ui.js',
          './bower_components/angular/angular.js',
          './bower_components/angular-route/angular-route.js',
          './bower_components/angular-ui-date/src/date.js',
          './bower_components/mobile-angular-ui/dist/js/mobile-angular-ui.js'
        ],

        fonts: [
          './bower_components/font-awesome/fonts/fontawesome-webfont.*'
        ],
        plugin: {
          css: [
          './bower_components/jquery-ui/themes/smoothness/jquery-ui.css'
          ],
          images: [
            './bower_components/jquery-ui/themes/smoothness/images/*'
          ]
        } 
    },
}
/*========================================
=            Requiring stuffs            =
========================================*/

var gulp           = require('gulp'),
    del            = require('del'),
    seq            = require('run-sequence'),
    mobilizer      = require('gulp-mobilizer'),
    uglify         = require('gulp-uglify'),
    sourcemaps     = require('gulp-sourcemaps'),
    less           = require('gulp-less'),
    cssmin         = require('gulp-cssmin'),
    order          = require('gulp-order'),
    concat         = require('gulp-concat'),
    ignore         = require('gulp-ignore'),
    rimraf         = require('gulp-rimraf'),

    // connect        = require('gulp-connect'),
    // imagemin       = require('gulp-imagemin'),
    // pngcrush       = require('imagemin-pngcrush'),
    // templateCache  = require('gulp-angular-templatecache'),
    // ngAnnotate     = require('gulp-ng-annotate'),
    // replace        = require('gulp-replace'),
    // ngFilesort     = require('gulp-angular-filesort'),
    // streamqueue    = require('streamqueue'),
    // rename         = require('gulp-rename'),
    path           = require('path');


/*================================================
=            Report Errors to Console            =
================================================*/

gulp.on('err', function(e) {
  console.log(e.err.stack);
});


/*=========================================
=            Clean dest folder            =
=========================================*/

gulp.task('clean', function (cb) {
  del(path.join('dist',config.project),cb);
});

/*==================================
=       Copy server related        =
==================================*/

gulp.task('app.js', function(){
    return gulp.src(path.join(config.project,'app.js'))
                .pipe(gulp.dest(path.join('dist',config.project)));
});
gulp.task('views', function(){
    return gulp.src(path.join(config.project,'views/**/*'))
                .pipe(gulp.dest(path.join('dist',config.project,'views')));
});
gulp.task('routes', function(){
    return gulp.src(path.join(config.project,'routes/**/*'))
                .pipe(gulp.dest(path.join('dist',config.project,'routes')));
});
gulp.task('models', function(){
    return gulp.src(path.join(config.project,'models/**/*'))
                .pipe(gulp.dest(path.join('dist',config.project,'models')));
});
gulp.task('config', function(){
    return gulp.src(path.join(config.project,'config/**/*'))
                .pipe(gulp.dest(path.join('dist',config.project,'config')));
});

gulp.task('server', function(done) {
    var tasks = ['app.js','views','routes','models','config'];
    seq(tasks,done);
});

// /*==================================
// =            Copy fonts            =
// ==================================*/

gulp.task('fonts', function() {
  return gulp.src(path.join(config.project,'public/fonts/**/*'))
  .pipe(gulp.dest(path.join('dist',config.project, 'public/fonts')));
});


/*======================================================================
=            Compile, minify, mobilize less                            =
======================================================================*/

gulp.task('less', function () {
  return gulp.src([
        path.join(config.project,'public/less/app.less')
        // ,path.join(config.project, 'public/less/responsive.less')
    ])
    .pipe(less({
      paths: [
          path.resolve(__dirname, config.project ,'public/less')
          , path.resolve(__dirname, 'bower_components')
        ]
    }))
    .pipe(mobilizer('app.css', {
      'app.css': {
        hover: 'exclude',
        screens: ['0px']      
      },
      'hover.css': {
        hover: 'only',
        screens: ['0px']
      }
    }))
    .pipe(cssmin())
    // .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(path.join('dist',config.project, 'public/css')));
});


// /*=====================================
// =            Minify images            =
// =====================================*/

// gulp.task('images', function () {
//   var stream = gulp.src(path.join(config.src,'images/**/*'))
  
//   if (config.minify_images) {
//     stream = stream.pipe(imagemin({
//         progressive: true,
//         svgoPlugins: [{removeViewBox: false}],
//         use: [pngcrush()]
//     }))
//   };
  
//   return stream.pipe(gulp.dest(path.join(config.dest, 'images')));
// });


// /*======================================
// =            Build Sequence            =
// ======================================*/

// gulp.task('build', function(done) {
//   seq('clean', ['fonts', 'css',  'js'], done);
// });

/*====================================
=            Default Task            =
====================================*/

gulp.task('default', function(done){
  var tasks = ['server','fonts','less'];
  seq('clean',tasks, done);
});