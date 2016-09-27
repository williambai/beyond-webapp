var gulp = require('gulp');
var path = require('path');
var connect = require('gulp-connect');

/*==========================================
=            Start a web server            =
==========================================*/

gulp.task('connect', function(){
	connect.server({
		root: './',
		host: '0.0.0.0',
		port: 8000,
		livereload: true
	});
});

/*==============================================================
=            Setup live reloading on source changes            =
==============================================================*/

gulp.task('liveload', function(){
	gulp.src('**/*.html').pipe(connect.reload());
});

gulp.task('watch', function(){
	gulp.watch(['**/*.html','**/*.tpl','**/*.js'],['liveload']);
});

/*==========================================
=            for development               =
==========================================*/

gulp.task('development', ['connect','watch']);

/*==========================================
=            for release                   =
==========================================*/

gulp.task('deploy');


/*====================================
=            Default Task            =
====================================*/

gulp.task('default', function(){
  console.log("\nUsage:\n");
  console.log("|- command: gulp development");
  console.log("  |- description: to develop the application.\n");
  console.log("|-command: gulp deploy");
  console.log("  |- description: to deploy application into '../_apps/'.\n");
  console.error("WARNING!!! ");
  console.error("****deploy will overwrite '../_apps/' directory.****\n");
  // console.log("|- command: gulp clean");
  // console.log("  |- description: to clean application.\n");
});