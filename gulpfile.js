var gulp         = require('gulp');
var concat       = require('gulp-concat');
var header       = require('gulp-header');
var footer       = require('gulp-footer');
var jshint       = require('gulp-jshint');
var uglify       = require('gulp-uglify');
var rename       = require('gulp-rename');
var minifyHTML   = require('gulp-minify-html');
var karma        = require('karma');
var fs           = require('fs');

var clog         = require('conventional-changelog');

function buildJs() {
    return gulp.src(['src/*.js', 'src/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter())
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

function conventionalChangelog(done) {
    var log = clog({
        preset: 'angular',
        repository: 'https://github.com/troch/angular-multi-step-form'
    }, function (err, log) {
        console.log(log);
        fs.writeFile('CHANGELOG.md', log, done);
    });
}

gulp.task('clog', conventionalChangelog);

gulp.task('test', gulp.series(buildJs, lintTestFiles, runKarmaTests));

gulp.task('build', buildJs);
// gulp.task('build', gulp.parallel(buildJs, 'test'));
