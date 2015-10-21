/*=====================================
=        Default Configuration        =
=====================================*/

var config = {
      project: {
        name: 'social-work',
      },
      java_sign: {
        keystore: './build/cordova/sign/test.keystore',
        keystore_username: 'william',
        keystore_password: '123456',
      },
      ios_sign: {
          debug: {
            codeSignIdentitiy: "iPhone Development",
            provisioningProfile: "926c2bd6-8de9-4c2f-8407-1016d2d12954",
          },
          release: {
            codeSignIdentitiy: "iPhone Distribution",
            provisioningProfile: "70f699ad-faf1-4adE-8fea-9d84738fb306",
          }
       },
       minify_images: true,
  };

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
  del.sync(path.join(__dirname,'_dest/server'));
  done();
});
gulp.task('clean:desktop', function(done){
  del.sync(path.join(__dirname,'_dest/desktop'));
  done();
});
gulp.task('clean:mobile',function(done){
  del.sync(path.join(__dirname,'_dest/mobile'));
  done();
});

gulp.task('clean', function (cb) {
  seq('clean:server','clean:desktop','clean:mobile',cb);
});

/*==================================
=       Copy server related        =
==================================*/

gulp.task('server.js', function(done){
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

gulp.task('server.static', function(done){
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

gulp.task('server', function(done) {
    seq('server.js','server.static',done);
});

/*==================================
=            mkdir for server      =
==================================*/

gulp.task('directory', function(done){
  var dest_dir = path.join(__dirname,'_dest');
  var serv = path.join(__dirname,'_dest','server');
  var pub = path.join(__dirname,'_dest','server','public');
  var downloads = path.join(__dirname,'_dest','server','public','downloads');
  var uploads = path.join(__dirname,'_dest','server','public','upload');
  var updates = path.join(__dirname,'_dest','server','public','updates');
  var thirds = path.join(__dirname,'_dest','server','public','thirds');
  var images = path.join(__dirname,'_dest','server','public','images');
  
  if(!fs.existsSync(dest_dir)){
    fs.mkdirSync(dest_dir);
  }
  if(!fs.existsSync(serv)){
    fs.mkdirSync(serv);
  }
  if(!fs.existsSync(pub)){
    fs.mkdirSync(pub);
  }
  if(!fs.existsSync(downloads)){
    fs.mkdirSync(downloads);
  }
  if(!fs.existsSync(uploads)){
    fs.mkdirSync(uploads);
  }
  if(!fs.existsSync(updates)){
    fs.mkdirSync(updates);
  }
  if(!fs.existsSync(thirds)){
    fs.mkdirSync(thirds);
  }
  if(!fs.existsSync(images)){
    fs.mkdirSync(images);
  }
  done();
});

/*===========================================
=   build node-webkit clients(APP):         =
=   win32,win64,osx32,osx64,linux32,linux64 =
============================================*/

gulp.task('package.json', function(done){
  sh.cp('-f',
    path.join(__dirname,'build/node-webkit','package.json'),
    path.join(__dirname,'_app','package.json')
  );
  done();
});

gulp.task('node-webkit-builder', function(done){
  var NwBuilder = require('node-webkit-builder');
  var nw = new NwBuilder({
        files: path.join(__dirname,'_app','**/**'),
        platforms: ['win','osx','linux'],
        version: '0.12.2',//download node-webkit version
        appName: config.project.name,
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
        if(sh.test('-f',path.join(__dirname,'_app','package.json'))){
          sh.rm('-f',path.join(__dirname,'_app','package.json'));
        }
        done();
      })
      .catch(function(err){
        console.error(err);
      });
});

gulp.task('node-webkit-downloads',function(done){
  //zip&copy to downloads
  // var downloads = path.join(__dirname,'_dest','server','public','downloads');
  // if(!fs.existsSync(downloads)){
  //   fs.mkdirSync(downloads);
  // }
  gulp.src(path.join(__dirname,'_dest','desktop',config.project.name,'linux32'))
      .pipe(zip(config.project.name + '-linux32.zip'))
      .pipe(gulp.dest(path.join(__dirname,'_dest','server','public','downloads')));
  gulp.src(path.join(__dirname,'_dest','desktop',config.project.name,'linux64'))
      .pipe(zip(config.project.name + '-linux64.zip'))
      .pipe(gulp.dest(path.join(__dirname,'_dest','server','public','downloads')));
  gulp.src(path.join(__dirname,'_dest','desktop',config.project.name,'win32'))
      .pipe(zip(config.project.name + '-win32.zip'))
      .pipe(gulp.dest(path.join(__dirname,'_dest','server','public','downloads')));
  gulp.src(path.join(__dirname,'_dest','desktop',config.project.name,'win64'))
      .pipe(zip(config.project.name + '-win64.zip'))
      .pipe(gulp.dest(path.join(__dirname,'_dest','server','public','downloads')));
  gulp.src(path.join(__dirname,'_dest','desktop',config.project.name,'osx32'))
      .pipe(zip(config.project.name + '-osx32.zip'))
      .pipe(gulp.dest(path.join(__dirname,'_dest','server','public','downloads')));
  gulp.src(path.join(__dirname,'_dest','desktop',config.project.name,'osx64'))
      .pipe(zip(config.project.name + '-osx64.zip'))
      .pipe(gulp.dest(path.join(__dirname,'_dest','server','public','downloads')));
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
  var root_dir = path.join(__dirname);
  var target_dir = path.join(__dirname,'_dest/mobile');
  var config_file = path.join(__dirname, 'build/cordova/config.xml');
  var build_file = path.join(__dirname, 'build/cordova/build.json');
  var www_dir = path.join(__dirname,'_app/*');
  var res_dir = path.join(__dirname,'build/cordova/res')
  var platforms = ['android','ios'];

  if(!sh.test('-d', target_dir)){
    sh.mkdir(target_dir);
  }
  sh.cp(config_file,target_dir);
  sh.cp(build_file,target_dir);
  sh.cp('-r',www_dir, path.join(__dirname,'_dest/mobile/www'));
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
  seq('clean:server','directory','server', done);
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