'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _directivesMultiStepContainer = require('./directives/multi-step-container');

var _directivesMultiStepContainer2 = _interopRequireDefault(_directivesMultiStepContainer);

var _directivesFormStepValidity = require('./directives/form-step-validity');

var _directivesFormStepValidity2 = _interopRequireDefault(_directivesFormStepValidity);

var _directivesStepContainer = require('./directives/step-container');

var _directivesStepContainer2 = _interopRequireDefault(_directivesStepContainer);

var _servicesFormStepElementFactory = require('./services/form-step-element-factory');

var _servicesFormStepElementFactory2 = _interopRequireDefault(_servicesFormStepElementFactory);

var _servicesFormStepObject = require('./services/form-step-object');

var _servicesFormStepObject2 = _interopRequireDefault(_servicesFormStepObject);

var _servicesMultiStepFormFactory = require('./services/multi-step-form-factory');

var _servicesMultiStepFormFactory2 = _interopRequireDefault(_servicesMultiStepFormFactory);

/**
 * @ngdoc module
 * @name  multiStepForm
 */
var multiStepFormModule = _angular2['default'].module('multiStepForm', [/*'ngAnimate'*/]);

multiStepFormModule.directive('formStepValidity', _directivesFormStepValidity2['default']).directive('multiStepContainer', _directivesMultiStepContainer2['default']).directive('stepContainer', _directivesStepContainer2['default']).factory('formStepElement', _servicesFormStepElementFactory2['default']).factory('FormStep', _servicesFormStepObject2['default']).factory('multiStepForm', _servicesMultiStepFormFactory2['default']);

exports['default'] = multiStepFormModule;
module.exports = exports['default'];