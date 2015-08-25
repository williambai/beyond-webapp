var config = {

	dest: '../_app', 
	dest2: '../public', 
	server: {
		host: '0.0.0.0',
		port: '8000'
	},
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


var browserify = require('browserify');
var gulp = require('gulp');
var connect = require('gulp-connect');
var path = require('path');
var seq = require('run-sequence');
var jade = require('gulp-jade');
var del = require('del');
var less = require('gulp-less');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');

/*=========================================
=            Clean dest folder            =
=========================================*/

gulp.task('clean',function(cb) {
	del([
		path.join(config.dest,'**/*'),
		path.join(config.dest2,'**/*')
	],{force: true},cb);
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

gulp.task('js',function(){
	var b = browserify({
			entries: path.join(__dirname,'/src/main.js'),
			debug: false
		});
	var source = require('vinyl-source-stream');
	// var tplTransform = require('node-underscorify').transform({
	// 	    extensions: ['tpl'],
	// 	});

	// b.transform(tplTransform);

	return b.bundle()
			.pipe(source('main.js'))
			// .pipe(streamify(uglify()))
			.pipe(rename('main.js'))
			.pipe(gulp.dest(path.join(__dirname,config.dest,'js')));
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
	gulp.watch(path.join(__dirname,'src/**/*'),['js']);
	gulp.watch(path.join(__dirname,'assets/less/**/*'),['less']);
	gulp.watch(path.join(__dirname,'assets/css/**/*'),['css']);
	gulp.watch(path.join(__dirname,'assets/**/*.html'),['html']);
	gulp.watch(path.join(__dirname,'assets/**/*.jade'),['jade']);
	gulp.watch(path.join(__dirname,config.dest),['public']);
});

/*======================================
=            Build Sequence            =
======================================*/

gulp.task('build',function(done) {
	var tasks = [
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

gulp.task('default',function(done){
	var tasks = [];
	if(typeof config.server === 'object'){
		tasks.push('connect');
	}
	tasks.push('watch');
	seq(tasks,done);
});