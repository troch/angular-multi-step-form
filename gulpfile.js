var gulp         = require('gulp');
var concat       = require('gulp-concat');
var header       = require('gulp-header');
var footer       = require('gulp-footer');
var jshint       = require('gulp-jshint');
var uglify       = require('gulp-uglify');
var rename       = require('gulp-rename');
var html2js      = require('gulp-ng-html2js');
var merge        = require('merge2');
var minifyHTML   = require('gulp-minify-html');
var karma        = require('karma');

function buildJs() {
    return merge(
            gulp.src(['src/*.js', 'src/**/*.js', '!src/**/*.spec.js'])
                .pipe(jshint())
                .pipe(jshint.reporter()),
            gulp.src('src/**/*.html')
                .pipe(minifyHTML())
                .pipe(html2js({
                    moduleName: 'multiStepForm.templates',
                    prefix: 'multi-step-form/',
                    stripPrefix: 'src/',
                    declareModule: true
                }))
        )
        .pipe(concat('angular-multi-step-form.js'))
        .pipe(header('(function(window, angular){\n"use strict";\n'))
        .pipe(footer('\n})(window, window.angular);'))
        .pipe(gulp.dest('dist'))
        .pipe(uglify())
        .pipe(rename('angular-multi-step-form.min.js'))
        .pipe(gulp.dest('dist'));
}

function lintTestFiles() {
    return  gulp.src('src/**/*.spec.js')
        .pipe(jshint())
        .pipe(jshint.reporter());
}

function runKarmaTests(done) {
    karma.server.start({
        configFile: __dirname + '/karma.config.js',
        singleRun: true
    }, done);
}

gulp.task('test', gulp.series(buildJs, lintTestFiles, runKarmaTests));

gulp.task('build', buildJs);
// gulp.task('build', gulp.parallel(buildJs, 'test'));
