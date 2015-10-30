var config = {

	dest: '../_app', 
	dest2: '../public', 
	server: {
		host: '0.0.0.0',
		port: '8000'
	},
    cordova: false,
	plugin: {
		fonts: [
   		   '../../bower_components/font-awesome/fonts/*.*'   		   
      	],
      	css: [
      	],
      	images: [
      	],
      	js: [
      	]
	}
};
var sh = require('shelljs');

var browserify = require('browserify');
var gulp = require('gulp');
var connect = require('gulp-connect');
var path = require('path');
var seq = require('run-sequence');
var jade = require('gulp-jade');
var less = require('gulp-less');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');

/*=========================================
=            Clean dest folder            =
=========================================*/

gulp.task('clean',function(done) {
	sh.rm('-rf', path.join(config.dest,'*'));
	done();
});

/*=========================================
=            Create dest folder            =
=========================================*/

gulp.task('mkdir', function(done){
	var dest_dir = path.join(__dirname,config.dest);
	if(!sh.test(dest_dir)){
		sh.mkdir('-p', dest_dir);
	}
	done();
});
/*==========================================
=            Start a web server            =
==========================================*/

gulp.task('connect', function(){
	if(typeof config.server === 'object'){
		connect.server({
			root: config.dest,
			host: config.server.host,
			port: config.server.port,
			livereload: true
		});
	}else{
		throw new Error('Connect is not configure.');
	}
});

/*==============================================================
=            Setup live reloading on source changes            =
==============================================================*/

gulp.task('livereload',function(){
	gulp.src(path.join(config.dest,'*.html'))
		.pipe(connect.reload());
});


/*==================================
=            Copy plugin fonts            =
==================================*/

gulp.task('plugin-fonts',function(){
	gulp.src(config.plugin.fonts)
	.pipe(gulp.dest(path.join(config.dest, 'fonts')));
});

/*==================================
=            Copy plugin CSS       =
==================================*/

gulp.task('plugin-css',function(){
	gulp.src(config.plugin.css)
	.pipe(gulp.dest(path.join(config.dest,'css')));	
});

/*==================================
=            Copy plugin images    =
==================================*/

gulp.task('plugin-images',function(){
	gulp.src(config.plugin.images)
	.pipe(gulp.dest(path.join(config.dest,'images')));
});

/*==================================
=            Copy plugin images    =
==================================*/

gulp.task('plugin-js',function(){
	gulp.src(config.plugin.js)
	.pipe(gulp.dest(path.join(config.dest,'js')));
});


/*======================================================================
=            Compile js                            =
======================================================================*/

var source = require('vinyl-source-stream');
var _bundleJS = function(arr,done){
	var entry = arr.pop();
	if(!entry) return done();
	var b = browserify({debug: false});
	b.add(path.join(__dirname,'src',entry));
	// var tplTransform = require('node-underscorify').transform({
	// 	    extensions: ['tpl'],
	// 	});

	// b.transform(tplTransform);
	b.bundle()
		 .pipe(source(entry))
		// .pipe(streamify(uglify()))
		.pipe(gulp.dest(path.join(__dirname,config.dest,'js')));
	_bundleJS(arr,done);
};

gulp.task('main.js',function(done){
	var entries = [
		'main.js',
	];
	_bundleJS(entries,done);
});

gulp.task('wechat.js',function(done){
	var entries = [
		'wechat.js'
	];
	_bundleJS(entries,done);
});

gulp.task('admin.js',function(done){
	var entries = [
		'admin.js'
	];
	_bundleJS(entries,done);
});

gulp.task('js', function(done){
	seq('main.js','wechat.js', 'admin.js',done);
});
/*======================================================================
=            Compile less                            =
======================================================================*/

gulp.task('less',function(){
	gulp.src(path.join(__dirname,'assets/less/app.less'))
		.pipe(less({
		  paths: [ path.resolve(__dirname,'public/less')]
		}))
		.pipe(cssmin())
		.pipe(rename('app.css'))
		.pipe(gulp.dest(path.join(config.dest,'css')));
});

/*======================================================================
=            Compile css                            =
======================================================================*/

gulp.task('css',function(){
	gulp.src(path.join(__dirname,'assets/css/**/*'))
		.pipe(gulp.dest(path.join(config.dest,'css')));
});

/*======================================================================
=            Compile css                            =
======================================================================*/

gulp.task('images',function(){
	gulp.src(path.join(__dirname, 'assets/images/**/*'))
		.pipe(gulp.dest(path.join(config.dest,'images')));
});

/*======================================================================
=            Compile jade                            =
======================================================================*/

gulp.task('jade',function(){
	gulp.src(path.join(__dirname, 'assets/**/*.jade'))
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest(config.dest));
});

/*=================================================
=            Copy html files to dest              =
=================================================*/

gulp.task('html', function() {
	gulp.src(path.join(__dirname,'assets/**/*.html'))
		.pipe(gulp.dest(config.dest));
});


/*=================================================
=            Copy _app/ files to public/          =
=================================================*/

gulp.task('public', function() {
	gulp.src(path.join(__dirname, config.dest,'/**/*'))
		.pipe(gulp.dest(path.join(__dirname,config.dest2)));
});


/*===================================================================
=            Watch for source changes and rebuild/reload            =
===================================================================*/

gulp.task('watch',function(){
	if(typeof config.server === 'object'){
		gulp.watch([config.dest +'/**/*'],['livereload']);
	}
	gulp.watch(path.join(__dirname,'**/*'),['js']);
	gulp.watch(path.join(__dirname,'assets/less/**/*'),['less']);
	gulp.watch(path.join(__dirname,'assets/css/**/*'),['css']);
	gulp.watch(path.join(__dirname,'assets/**/*.html'),['html']);
	gulp.watch(path.join(__dirname,'assets/**/*.jade'),['jade']);
	gulp.watch(path.join(__dirname,config.dest,'**/*'),['public']);
});

/*======================================
=            Build Sequence            =
======================================*/

gulp.task('build',function(done) {
	var tasks = [
					'mkdir',
					'plugin-fonts',
					'plugin-css',
					'plugin-images',
					'plugin-js',
					'js',
					'less',
					'css',
					'images',
					'html',
					'jade',
				];
	seq('clean',tasks,'public',done);	
});

/*====================================
=            Default Task            =
====================================*/

gulp.task('development',function(done){
	var tasks = [];
	if(typeof config.server === 'object'){
		tasks.push('connect');
	}
	tasks.push('watch');
	seq(tasks,done);
});

/*====================================
=            Default Task            =
====================================*/

gulp.task('default', function(){
  console.log("\nUsage:\n");
  console.error("WARNING!!! ");
  console.error("****This build will overwrite '../_app/' and '../public/' directory.****\n");
  console.log("|- command: gulp development");
  console.log("  |- description: to develop the application, which will watch files and create '../_app/' and '../public/' directory.\n");
  console.log("|-command: gulp build");
  console.log("  |- description: to build application into '../_app/' and '../public/' directory.\n");
  console.log("|- command: gulp clean");
  console.log("  |- description: to clean application.\n");
});