'use strict';

var gulp = require('gulp');
var stylus = require('gulp-stylus');
var nib = require('nib');
var sourcemaps = require('gulp-sourcemaps');

var cssPath = 'public/css';
var stylusPath = 'styles';

gulp.task('styles', function () {
    gulp.src(stylusPath + '/*.styl')
        .pipe(sourcemaps.init())
        .pipe(stylus({
            paths:  ['node_modules', 'styles/globals'],
            import: ['jeet/stylus/jeet', 'stylus-type-utils', 'nib', 'rupture/rupture'], //, 'variables', 'mixins'
            use: [nib()],
            'include css': true
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(cssPath))
});

gulp.task('watch', function () {
      gulp.watch(stylusPath + '/**/*.styl', ['styles']);
});


gulp.task('default', ['watch']);