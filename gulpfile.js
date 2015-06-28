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
    replace        = require('gulp-replace');
    seq            = require('run-sequence'),
    jade           = require('gulp-jade'),
    mobilizer      = require('gulp-mobilizer'),
    uglify         = require('gulp-uglify'),
    sourcemaps     = require('gulp-sourcemaps'),
    less           = require('gulp-less'),
    cssmin         = require('gulp-cssmin'),
    order          = require('gulp-order'),
    concat         = require('gulp-concat'),
    rename         = require('gulp-rename'),
    zip            = require('gulp-zip'),
    ignore         = require('gulp-ignore'),
    rimraf         = require('gulp-rimraf'),
    path           = require('path'),
    fs             = require('fs');
;


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
  del.sync(path.join(__dirname,'dist',config.project));
  done();
});
gulp.task('clean:node-webkit', function(done){
  del.sync(path.join(__dirname,'dist','node-webkit'));
  done();
});
gulp.task('clean:cordova',function(done){
  del.sync(path.join(__dirname,'dist','cordova'));
  done();
});

gulp.task('clean', function (cb) {
  var tasks = ['clean:project','clean:node-webkit','clean:cordova'];
  seq(tasks,cb);
});

/*==================================
=            mkdir                 =
==================================*/

gulp.task('directory', function(done){
  // var project_dir = path.join(__dirname,'dist',config.project);
  // var public_dir = path.join(__dirname,'dist',config.project,'public');
  var downloads = path.join(__dirname,'dist',config.project,'public','downloads');
  var upload = path.join(__dirname,'dist',config.project,'public','upload');
  // if(!fs.existsSync(project_dir)){
  //   fs.mkdirSync(project_dir);
  // }
  // if(!fs.existsSync(public_dir)){
  //   fs.mkdirSync(public_dir);
  // }
  if(!fs.existsSync(downloads)){
    fs.mkdirSync(downloads);
  }
  if(!fs.existsSync(upload)){
    fs.mkdirSync(upload);
  }
  done();
});

/*==================================
=       Copy server related        =
==================================*/

gulp.task('app.js', function(){
    return gulp.src(path.join(config.project,'app.js'))
                .pipe(uglify())
                .pipe(gulp.dest(path.join('dist',config.project)));
});
gulp.task('views', function(){
    return gulp.src(path.join(config.project,'views/**/*'))
                .pipe(gulp.dest(path.join('dist',config.project,'views')));
});
gulp.task('libs', function(){
    return gulp.src(path.join(config.project,'libs/**/*'))
                .pipe(uglify())
                .pipe(gulp.dest(path.join('dist',config.project,'libs')));
});
gulp.task('routes', function(){
    return gulp.src(path.join(config.project,'routes/**/*'))
                .pipe(uglify())
                .pipe(gulp.dest(path.join('dist',config.project,'routes')));
});
gulp.task('models', function(){
    return gulp.src(path.join(config.project,'models/**/*'))
                .pipe(uglify())
                .pipe(gulp.dest(path.join('dist',config.project,'models')));
});
gulp.task('config', function(){
    return gulp.src(path.join(config.project,'config/**/*'))
                .pipe(uglify())
                .pipe(gulp.dest(path.join('dist',config.project,'config')));
});
gulp.task('commands', function(){
    return gulp.src(path.join(config.project,'commands/**/*'))
                .pipe(gulp.dest(path.join('dist',config.project,'commands')));
});

gulp.task('server', function(done) {
    var tasks = ['app.js','views','libs','routes','models','config','commands'];
    seq(tasks,done);
});

/*==================================
=            Copy htmls            =
==================================*/

gulp.task('copy-html', function(done) {
  return gulp.src(path.join(config.project,'public/*.html'))
  .pipe(gulp.dest(path.join('dist',config.project, 'public')));
  done();
});

gulp.task('index.html', function(done){
  gulp.src(path.join(config.project,'public/index.html'))
      .pipe(replace('data-main="js/boot" ',''))
      .pipe(replace('js/libs/require.js','/js/main.js'))
      .pipe(gulp.dest(path.join('dist',config.project, 'public')));
  done();
});

gulp.task('wechat.html', function(done){
  gulp.src(path.join(config.project,'public/wechat.html'))
      .pipe(replace('data-main="js/boot_wechat" ',''))
      .pipe(replace('js/libs/require.js','/js/main_wechat.js'))
      .pipe(gulp.dest(path.join('dist',config.project, 'public')));
  done();
});

gulp.task('htmls', function(done){
  seq('copy-html','index.html','wechat.html',done);
});

/*==================================
=            Copy fonts            =
==================================*/

gulp.task('fonts', function(done) {
  return gulp.src(path.join(config.project,'public/fonts/**/*'))
  .pipe(gulp.dest(path.join('dist',config.project, 'public','fonts')));
  done();
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


gulp.task('main.js', function(done){
  var requirejs = require('requirejs');
  var configJs = {
        baseUrl: __dirname + '/' + config.project + '/public/js',
        mainConfigFile: __dirname + '/' + config.project + '/public/js/boot.js',
        findNestedDependencies: true,
        optimize: 'uglify',//none
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

gulp.task('main_wechat.js', function(done){
  var requirejs = require('requirejs');
  var configJs = {
        baseUrl: __dirname + '/' + config.project + '/public/js',
        mainConfigFile: __dirname + '/' + config.project + '/public/js/boot_wechat.js',
        findNestedDependencies: true,
        optimize: 'uglify',//none
        name: 'main_wechat',
        out: __dirname + '/dist/' + config.project + '/public/js/main_wechat.js',
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

gulp.task('js',function(done){
  seq('main.js','main_wechat.js', done);
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

gulp.task('node-webkit-downloads',function(done){
  //zip&copy to downloads
  var downloads = path.join(__dirname,'dist',config.project,'public','downloads');
  if(!fs.existsSync(downloads)){
    fs.mkdirSync(downloads);
  }
  gulp.src(path.join('dist','node-webkit',config.project,'linux32'))
      .pipe(zip('SocialWork-linux32.zip'))
      .pipe(gulp.dest(path.join('dist',config.project,'public','downloads')));
  gulp.src(path.join('dist','node-webkit',config.project,'linux64'))
      .pipe(zip('SocialWork-linux64.zip'))
      .pipe(gulp.dest(path.join('dist',config.project,'public','downloads')));
  gulp.src(path.join('dist','node-webkit',config.project,'win32'))
      .pipe(zip('SocialWork-win32.zip'))
      .pipe(gulp.dest(path.join('dist',config.project,'public','downloads')));
  gulp.src(path.join('dist','node-webkit',config.project,'win64'))
      .pipe(zip('SocialWork-win64.zip'))
      .pipe(gulp.dest(path.join('dist',config.project,'public','downloads')));
  gulp.src(path.join('dist','node-webkit',config.project,'osx32'))
      .pipe(zip('SocialWork-osx32.zip'))
      .pipe(gulp.dest(path.join('dist',config.project,'public','downloads')));
  gulp.src(path.join('dist','node-webkit',config.project,'osx64'))
      .pipe(zip('SocialWork-osx64.zip'))
      .pipe(gulp.dest(path.join('dist',config.project,'public','downloads')));
  done();
});

gulp.task('node-webkit', function(done){
  seq('package.json','node-webkit-builder','node-webkit-downloads',done);
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

  if(!fs.existsSync(buildDir)){
   fs.mkdirSync(buildDir);
  }
  var projectDir = path.join(__dirname);
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
  process.chdir(projectDir);
  //copy to downloads directory
  var downloads = path.join(__dirname,'dist',config.project,'public','downloads');
  if(!fs.existsSync(downloads)){
    fs.mkdirSync(downloads);
  }
  gulp.src(path.join('dist','cordova','platforms','android','ant-build','CordovaApp-release-unsigned.apk'))
      .pipe(rename('socialWork.apk'))
      .pipe(gulp.dest(path.join('dist',config.project,'public','downloads')));
  gulp.src(path.join('dist','cordova','platforms/ios/build/**/*'))
      .pipe(zip('socialWork.ipa'))
      .pipe(gulp.dest(path.join('dist',config.project,'public','downloads')));
  done();
});

/*====================================
=            Build Task            =
====================================*/

gulp.task('build:project', function(done){
  var tasks = ['server','htmls','fonts','less','js'];
  seq('clean:project',tasks,'directory', done);
});
gulp.task('build:client', function(done){
  var tasks = [];
  seq('clean:cordova','clean:node-webkit','cordova','node-webkit', done);
});

gulp.task('build', function(done){
  seq('build:project','build:client', done);
});

/*====================================
=            Default Task            =
====================================*/

gulp.task('default', function(){
  console.log("Usage:\n\n");
  console.log("command: gulp build\n");
  console.log("description: to build project's project and clients.\n\n");
  console.log("command: gulp build:project\n");
  console.log("description: to build project's project.\n\n");
  console.log("command: gulp build:client\n");
  console.log("description: to build cordova and node-webkit clients.\n\n");
});