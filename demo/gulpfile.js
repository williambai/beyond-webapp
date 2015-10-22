var config = require('./config');
/*========================================
=            Requiring stuffs            =
========================================*/
var sh = require('shelljs');

var gulp           = require('gulp'),
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

/*=========================================
=     Report Errors to Console            =
==========================================*/

gulp.on('err', function(e) {
  console.log(e.err.stack);
});

/*=========================================
=            Clean dest folder            =
=========================================*/

gulp.task('clean:server', function(done){
  sh.rm('-rf',path.join(__dirname,'_dest/server'));
  done();
});
gulp.task('clean:desktop', function(done){
  sh.rm('-rf',path.join(__dirname,'_dest/desktop'));
  done();
});
gulp.task('clean:mobile',function(done){
  sh.rm('-rf',path.join(__dirname,'_dest/mobile'));
  done();
});

gulp.task('clean', function(done) {
  seq('clean:server','clean:desktop','clean:mobile',done);
});


/*==================================
=    prepare for server built      =
==================================*/

gulp.task('server:prepare', function(done){
  var dirs = [
        path.join(__dirname,'_dest'),
        path.join(__dirname,'_dest','server','public','downloads'),
        path.join(__dirname,'_dest','server','public','upload'),
        path.join(__dirname,'_dest','server','public','updates'),
        path.join(__dirname,'_dest','server','public','thirds'),
        path.join(__dirname,'_dest','server','public','images')
      ];
  for(var i in dirs){
    if(!sh.test('-d', dirs[i])){
      sh.mkdir('-p', dirs[i]);
    }
  }
  done();
});

/*==================================
=       build js for server        =
==================================*/

gulp.task('server:js', function(done){
    gulp.src([
              '**/*.js',
              '!_*/**/*',
              '!app/**/*',
              '!build/**/*',
              '!config/**/*',
              '!test/**/*',
              '!commands/**/*',
              '!gulpfile.js',
              '!public/_tmp/**/**',
              '!public/upload/**/*',
            ])
            .pipe(uglify())
            .pipe(gulp.dest('_dest/server'));
    //特殊情况        
    gulp.src([
              'commands/**/*.js',
            ])
            .pipe(gulp.dest('_dest/server/commands'));
    done();
});


/*==================================
=       Copy server related        =
==================================*/

gulp.task('server:copy', function(done){
    gulp.src([
              '**/*.jade',
              '**/*.@(html|htm)',
              '**/*.@(json|txt)',
              '**/*.css',
              '**/*.@(eot|svg|ttf|woff|woff2|otf)',
              '**/*.@(png|jpg|gif)',
              '**/*.wsdl',
              '!_*/**/*',
              '!app/**/*',
              '!build/**/*',
              '!test/**/*',
              '!config/**/*',
              '!public/_*/**/*',
              '!public/upload/**/*',
            ])
            .pipe(gulp.dest(path.join(__dirname,'_dest','server')));
   done();         
});


/*===========================================
=   build node-webkit clients(APP):         =
=   win32,win64,osx32,osx64,linux32,linux64 =
============================================*/

gulp.task('node-webkit:prepare', function(done){
  var www_dir = path.join(__dirname,'_dest/desktop/www');
  if(!sh.test(www_dir)){
    sh.mkdir('-p',www_dir);
  }
  sh.cp('-rf',
        path.join(__dirname,'_app/*'),
        www_dir);
  sh.cp('-f',
        path.join(__dirname,'build/node-webkit','package.json'),
        www_dir);

  done();
});

gulp.task('node-webkit:builder', function(done){
  var NwBuilder = require('node-webkit-builder');
  var nw = new NwBuilder({
        files: path.join(__dirname,'_dest/desktop/www','**/**'),
        platforms: ['win','osx','linux'],
        version: '0.12.2',//download node-webkit version
        appName: 'platforms',
        buildDir: path.join(__dirname,'./_dest/desktop'),
        cacheDir: path.join(__dirname,'../_cache'),
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

gulp.task('node-webkit:deploy',function(done){
  //zip&copy to downloads
  var deploy_dir = path.join(__dirname,'_dest','server','public','downloads');
  if(!sh.test('-d',deploy_dir)){
    sh.mkdir('-p', deploy_dir);
  }
  gulp.src(path.join(__dirname,'_dest/desktop/platforms','linux32'))
      .pipe(zip(config.project.name + '-linux32.zip'))
      .pipe(gulp.dest(deploy_dir));
  gulp.src(path.join(__dirname,'_dest/desktop/platforms','linux64'))
      .pipe(zip(config.project.name + '-linux64.zip'))
      .pipe(gulp.dest(deploy_dir));
  gulp.src(path.join(__dirname,'_dest/desktop/platforms','win32'))
      .pipe(zip(config.project.name + '-win32.zip'))
      .pipe(gulp.dest(deploy_dir));
  gulp.src(path.join(__dirname,'_dest/desktop/platforms','win64'))
      .pipe(zip(config.project.name + '-win64.zip'))
      .pipe(gulp.dest(deploy_dir));
  gulp.src(path.join(__dirname,'_dest/desktop/platforms','osx32'))
      .pipe(zip(config.project.name + '-osx32.zip'))
      .pipe(gulp.dest(deploy_dir));
  gulp.src(path.join(__dirname,'_dest/desktop/platforms','osx64'))
      .pipe(zip(config.project.name + '-osx64.zip'))
      .pipe(gulp.dest(deploy_dir));
  done();
});

gulp.task('node-webkit', function(done){
  seq('node-webkit:prepare','node-webkit:builder','node-webkit:deploy',done);
});


/*===========================================
=   build cordova clients(APP):             =
=   android, ios                            =
============================================*/


gulp.task('cordova',function(done){
  //NOTE: npm install cordova-cli -g
  var root_dir = path.join(__dirname);
  var target_dir = path.join(__dirname,'_dest/mobile');
  var config_file = path.join(__dirname, 'build/cordova/config.xml');
  var build_file = path.join(__dirname, 'build/cordova/build.json');
  var www_dir = path.join(__dirname,'_app/*');
  var res_dir = path.join(__dirname,'build/cordova/res')
  var platforms = ['android@' + config.platforms.android.version,'ios','browser'];

  if(!sh.test('-d', target_dir)){
    sh.mkdir(target_dir);
  }
  sh.cp(config_file,target_dir);
  // sh.cp(build_file,target_dir);
  sh.cp('-r',www_dir, path.join(__dirname,'_dest/mobile/www'));
  sh.cp('-rf',path.join(__dirname,'build/cordova/www/*'),path.join(__dirname,'_dest/mobile/www'));
  sh.cp('-r',res_dir, target_dir);
  sh.cd(target_dir);

  for(var i in platforms){
    sh.exec('cordova platform add ' + platforms[i]);
  }
  
  sh.exec('cordova prepare');
  sh.exec('cordova build --release');
  sh.cd(root_dir);
  
  //copy to downloads directory
  var downloads = path.join(__dirname,'_dest','server','public','downloads');
  if(!sh.test('-d',downloads)){
    sh.mkdir(downloads);
  }
  gulp.src(path.join(__dirname,'_dest','mobile','platforms/android/ant-build','CordovaApp-release-unsigned.apk'))
      .pipe(rename(config.project.name +'.apk'))
      .pipe(gulp.dest(path.join(__dirname,'_dest','server','public','downloads')));
  gulp.src(path.join(__dirname, '_dest','mobile','platforms/ios', config.project.name,'**/*'))
      .pipe(zip(config.project.name + '.ipa'))
      .pipe(gulp.dest(path.join(__dirname,'_dest','server','public','downloads')));
  done();
});

/*====================================
=            sign Task            =
====================================*/

gulp.task('android:sign', function(done){
  //java sign
  var unsigned_file = path.join(__dirname,'/_dest/server/public/downloads', config.project.name + '.apk ');
  if(sh.test('-f', unsigned_file)){
    sh.exec('jarsigner ' + 
              ' -keystore ' + config.java_sign.keystore + 
              ' -storepass ' + config.java_sign.keystore_password + 
              ' -digestalg SHA1 -sigalg MD5withRSA ' + 
              ' ./_dest/server/public/downloads/'+ config.project.name + '.apk ' + 
              config.java_sign.keystore_username);
  }else{
    console.log('WARNING: unsigned .apk file does not found, so unsigned.');
  }
  done();
});

/*====================================
=            Build Task            =
====================================*/

gulp.task('build:server', function(done){
  seq('clean:server','server:prepare','server:js','server:copy', done);
});

gulp.task('build:mobile', function(done){
  seq('clean:mobile','cordova','android:sign',done);
});

gulp.task('build:desktop', function(done){
  seq('clean:desktop','node-webkit',done);
});

gulp.task('build:client', function(done){
  seq('build:mobile','build:desktop', done);
});

gulp.task('build', function(done){
  seq('build:server','build:client', done);
});

/*====================================
=            Default Task            =
====================================*/

gulp.task('default', function(){
  console.log("\nUsage:\n");
  console.error("WARNING!!! ");
  console.error("****This build will overwrite './_dest/' directory.****\n");
  console.log("|- command: gulp build");
  console.log("  |- description: to deploy application's server and clients.\n");
  console.log("|- command: gulp build:server");
  console.log("  |- description: to deploy application's server.\n");
  console.log("|- command: gulp build:client");
  console.log("  |- description: to deploy cordova and node-webkit clients.\n");
  console.log("|- command: gulp build:mobile");
  console.log("  |- description: to deploy cordova clients only.\n");
  console.log("|- command: gulp build:desktop");
  console.log("  |- description: to deploy node-webkit clients only.\n");
});