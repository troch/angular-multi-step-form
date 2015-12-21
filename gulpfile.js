var gulp         = require('gulp');
var del          = require('del');
var babel        = require('gulp-babel');
var runSequence  = require('run-sequence');
var rename       = require('gulp-rename');
var uglify       = require('gulp-uglify');
var concat       = require('gulp-concat');
var ngAnnotate   = require('gulp-ng-annotate');
var header       = require('gulp-header');
var footer       = require('gulp-footer');
var rename       = require('gulp-rename');
var fs           = require('fs');

var files = [
    'src/*/*.js',
    'src/index.js'
];

var globalWrapper = {
    header: '(function (angular) {\n"use strict";\n',
    footer: '\n}(angular));\n'
};

function buildBundle() {
    return gulp.src(files)
        .pipe(babel({modules: 'ignore', blacklist: ['strict']}))
        .pipe(concat('angular-multi-step-form.js'))
        .pipe(header(globalWrapper.header))
        .pipe(footer(globalWrapper.footer))
        .pipe(ngAnnotate())
        .pipe(gulp.dest('dist/browser'))
        .pipe(uglify())
        .pipe(rename('angular-multi-step-form.min.js'))
        .pipe(gulp.dest('dist/browser'));
}

function buildJs() {
    return gulp.src(files)
        .pipe(babel({modules: 'common'}))
        .pipe(ngAnnotate())
        .pipe(gulp.dest('dist/commonjs'));
}

gulp.task('clean', function () {
    return del(['dist', 'coverage']);
});

gulp.task('buildBundle', ['clean'], buildBundle);
gulp.task('buildJs', ['clean'], buildJs);
gulp.task('build', ['buildBundle', 'buildJs']);
