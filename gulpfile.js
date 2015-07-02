'use strict';

var gulp = require('gulp');
// var debug = require('gulp-debug');
var del = require('del');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify'); //JS
var minifyCss = require('gulp-minify-css'); //CSS
var minifyHtml = require('gulp-minify-html'); //HTML
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var distPath = 'dist';

//delete dist folder
gulp.task('clean', function() {
    del.bind(null, [distPath]);
});

//copy
gulp.task('copy', function() {
    return gulp.src(['app/bower_components/**/*', 'app/assets/svg/*'], {
            base: 'app'
        })
        // .pipe(debug({
        //     title: 'copy -> '
        // }))
        .pipe(gulp.dest(distPath));

});

//js files
gulp.task('js', function() {
    return gulp.src('app/src/**/*.js', {
            base: 'app'
        })
        .pipe(uglify())
        // .pipe(debug({
        //     title: 'min src js -> '
        // }))
        .pipe(gulp.dest(distPath));
});

//html files
gulp.task('html', function() {
    return gulp.src(['app/*.html', 'app/src/**/*.html'], {
            base: 'app'
        })
        .pipe(minifyHtml())
        // .pipe(debug({
        //     title: 'min src html -> '
        // }))
        .pipe(gulp.dest(distPath));
});

//css files
gulp.task('css', function() {
    return gulp.src(['app/src/**/*.css', 'app/assets/**/*.css'], {
            base: 'app'
        })
        .pipe(minifyCss())
        // .pipe(debug({
        //     title: 'min src css -> '
        // }))
        .pipe(gulp.dest(distPath));
});

//serve (test)
gulp.task('serve', function() {
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

//default
//make dist version
gulp.task('default', ['clean'], function() {
    runSequence('copy', 'js', 'css', 'html');
});
