'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _multiStepContainer = require('./directives/multi-step-container');

var _multiStepContainer2 = _interopRequireDefault(_multiStepContainer);

var _formStepValidity = require('./directives/form-step-validity');

var _formStepValidity2 = _interopRequireDefault(_formStepValidity);

var _stepContainer = require('./directives/step-container');

var _stepContainer2 = _interopRequireDefault(_stepContainer);

var _formStepElementFactory = require('./services/form-step-element-factory');

var _formStepElementFactory2 = _interopRequireDefault(_formStepElementFactory);

var _formStepObject = require('./services/form-step-object');

var _formStepObject2 = _interopRequireDefault(_formStepObject);

var _multiStepFormFactory = require('./services/multi-step-form-factory');

var _multiStepFormFactory2 = _interopRequireDefault(_multiStepFormFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @ngdoc module
 * @name  multiStepForm
 */
var multiStepFormModule = _angular2.default.module('multiStepForm', [/*'ngAnimate'*/]);

multiStepFormModule.directive('formStepValidity', _formStepValidity2.default).directive('multiStepContainer', _multiStepContainer2.default).directive('stepContainer', _stepContainer2.default).factory('formStepElement', _formStepElementFactory2.default).factory('FormStep', _formStepObject2.default).factory('multiStepForm', _multiStepFormFactory2.default);

exports.default = multiStepFormModule;