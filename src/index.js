import angular from 'angular';

import multiStepContainer from './directives/multi-step-container';
import formStepValidity from './directives/form-step-validity';
import stepContainer from './directives/step-container';
import formStepElement from './services/form-step-element-factory';
import FormStep from './services/form-step-object';
import multiStepForm from './services/multi-step-form-factory';

/**
 * @ngdoc module
 * @name  multiStepForm
 */
const multiStepFormModule = angular.module('multiStepForm', [/*'ngAnimate'*/]);

multiStepFormModule
    .directive('formStepValidity', formStepValidity)
    .directive('multiStepContainer', multiStepContainer)
    .directive('stepContainer', stepContainer)
    .factory('formStepElement', formStepElement)
    .factory('FormStep', FormStep)
    .factory('multiStepForm', multiStepForm);

export default multiStepFormModule;
