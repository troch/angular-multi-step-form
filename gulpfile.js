var gulp         = require('gulp');
var babel        = require('gulp-babel');
var runSequence  = require('run-sequence');
var rename       = require('gulp-rename');
var uglify       = require('gulp-uglify');
var del          = require('del');
var clog         = require('conventional-changelog');
var concat       = require('gulp-concat');
var header       = require('gulp-header');
var footer       = require('gulp-footer');
var rename       = require('gulp-rename');
var jshint       = require('gulp-jshint');
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
        .pipe(jshint({ esnext: true }))
        .pipe(jshint.reporter())
        .pipe(babel({modules: 'ignore', blacklist: ['strict']}))
        .pipe(concat('angular-multi-step-form.js'))
        .pipe(header(globalWrapper.header))
        .pipe(footer(globalWrapper.footer))
        .pipe(gulp.dest('dist/browser'))
        .pipe(uglify())
        .pipe(rename('angular-multi-step-form.min.js'))
        .pipe(gulp.dest('dist/browser'));
}

function buildJs() {
    return gulp.src(files)
        .pipe(jshint({ esnext: true }))
        .pipe(jshint.reporter())
        .pipe(babel({modules: 'common'}))
        .pipe(gulp.dest('dist/commonjs'));
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

gulp.task('clean', function () {
    return del(['dist', 'coverage']);
});

gulp.task('test', gulp.series(buildJs, lintTestFiles, runKarmaTests));

gulp.task('build', gulp.series(buildJs, buildBundle));
// gulp.task('build', gulp.parallel(buildJs, 'test'));
