module.exports = function (config) {
  config.set({
    /**
     * From where to look for files, starting with the location of this file.
     */
    basePath: '',
    /**
     * This is the list of file patterns to load into the browser during testing.
     */
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'src/*.js',
      'src/**/*.js',
      'tests/*.js'
    ],

    frameworks: [ 'jasmine' ],

    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-coverage',
      'karma-coveralls'
    ],
    /**
     * How to report, by default.
     */
    reporters: ['progress', 'coverage', 'coveralls'],

    coverageReporter: {
        dir: 'coverage',
        reporters: [
            {type: 'lcov'}
        ],
    },

    preprocessors: {
      'src/**/*.js': ['coverage']
    },

    port: 9876,
    colors: true,
    singleRun: true,
    autoWatch: false,
    browsers: ['Chrome']
  });
};

