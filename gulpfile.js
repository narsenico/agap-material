'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

//default
gulp.task('default', function() {
  //TODO make min (css, js, html), vulcanize (?), etc
});

//serve
gulp.task('serve', ['default'], function() {
    //
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
    //al cambiamento di un file esegue il reload del browser
    gulp.watch(['app/**/*.html'], reload);
    gulp.watch(['app/**/*.js'], reload);
    gulp.watch(['app/assets/*.css'], reload);
});
