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
var sh = require('shelljs');

var gulp           = require('gulp'),
    del            = require('del'),
    seq            = require('run-sequence'),
    jade           = require('gulp-jade'),
    mobilizer      = require('gulp-mobilizer'),
    uglify         = require('gulp-uglify'),
    sourcemaps     = require('gulp-sourcemaps'),
    less           = require('gulp-less'),
    cssmin         = require('gulp-cssmin'),
    order          = require('gulp-order'),
    concat         = require('gulp-concat'),
    ignore         = require('gulp-ignore'),
    rimraf         = require('gulp-rimraf'),
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
gulp.task('clean:project', function(done){
  del(path.join(__dirname,'dist',config.project));
  done();
});
gulp.task('clean:node-webkit', function(done){
  del(path.join(__dirname,'dist','node-webkit'));
  done();
});
gulp.task('clean:cordova',function(done){
  del(path.join(__dirname,'dist','cordova'));
  done();
});

gulp.task('clean', function (cb) {
  var tasks = ['clean:project','clean:node-webkit','clean:cordova'];
  seq(tasks,cb);
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

// /*=====================================
// =            Optimize js              =
// =====================================*/


gulp.task('js', function(done){
  var requirejs = require('requirejs');
  var configJs = {
        baseUrl: __dirname + '/' + config.project + '/public/js',
        mainConfigFile: __dirname + '/' + config.project + '/public/js/boot.js',
        findNestedDependencies: true,
        optimize: 'none',
        name: 'main',
        out: __dirname + '/dist/' + config.project + '/public/js/main.js',
        onModuleBundleComplete: function(data){
          var amdclean = require('amdclean');
          var fs = require('fs');
          var outputFile = data.path;
          fs.writeFileSync(outputFile, amdclean.clean({
            filePath: outputFile
          }));
        }
      };
      requirejs.optimize(configJs,function(buildResponse){
        // console.log(buildResponse);
        done();
      },function(err){
        console.log(err);
      });
  });

/*===================================
=        Compile jade               =
====================================*/

gulp.task('jade',function(){
  gulp.src(path.join(__dirname, config.project, 'views/index.jade'))
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest(path.join(__dirname,'dist', config.project, 'public')));
});

/*===========================================
=   build node-webkit clients(APP):         =
=   win32,win64,osx32,osx64,linux32,linux64 =
============================================*/

gulp.task('package.json', function(done){
  sh.cp(
    path.join(__dirname,config.project,'nodeWebkitPackage.json'),
    path.join(__dirname,'dist',config.project,'public','package.json')
  );
  done();
});

gulp.task('node-webkit-builder', function(done){
  var NwBuilder = require('node-webkit-builder');
  var nw = new NwBuilder({
        files: path.join(__dirname,'dist',config.project, '**','**'),
        platforms: ['win','osx','linux'],
        version: '0.12.2',//download node-webkit version
        appName: config.project,
        buildDir: './dist/node-webkit',
        cacheDir: './dist/cache',
        buildType: 'default',
        forceDownload: false,
        macCredits: false,
        macIcns: false,
        macZip: true,
        macPlist: false,
        winIco: null,
      });
    
    // nw.on('log', console.log);
    nw.build()
      .then(function(){
        done();
      })
      .catch(function(err){
        console.error(err);
      });
});

gulp.task('node-webkit', function(done){
  seq('package.json','node-webkit-builder',done);
});


/*===========================================
=   build cordova clients(APP):             =
=   android, ios                            =
============================================*/


gulp.task('cordova',function(done){
  //NOTE: npm install cordova-cli -g
  var buildDir = path.join(__dirname,'dist','cordova');
  var cordovaConfigFile = path.join(__dirname,config.project,'cordovaConfig.xml');
  var www_dir = path.join(__dirname,'dist',config.project, 'public');
  var platforms = ['android','ios'];
  var plugins = ['org.apache.cordova.file'];
  var fs = require('fs');

  if(!fs.existsSync(buildDir)){
   fs.mkdirSync(buildDir);
  }
  process.chdir(buildDir);

  if(!fs.existsSync(path.join(buildDir,'config.xml'))){
    fs.symlinkSync(cordovaConfigFile, 'config.xml');
  }
  if(!fs.existsSync(path.join(buildDir,'www'))){
    fs.symlinkSync(www_dir, 'www');
  }
  plugins.forEach(function(plugin){
    sh.exec('cordova plugin add ' + plugin);
  });

  platforms.forEach(function(platform){
    sh.exec('cordova platform add ' + platform);
  });
  sh.exec('cordova build --release');
  process.chdir(__dirname);
  done();
});

/*====================================
=            Default Task            =
====================================*/

gulp.task('default', function(done){
  var tasks = ['server','fonts','less','js'];
  seq('clean',tasks, done);
});