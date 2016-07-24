'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = ['$parse', formStepValidity];

/**
 * @ngdoc    directive
 * @name     multiStepForm:formStepValidity
 *
 * @restrict A
 * @description Notify the multi step form instance of a change of validity of a step.
 *              This directive can be used on a form element or within a form.
 */

function formStepValidity($parse) {
    return {
        restrict: 'A',
        require: '^form',
        link: function postLink(scope, element, attrs, formCtrl) {
            // The callback to call when a change of validity
            // is detected
            var validtyChangeCallback = attrs.formStepValidity ? $parse(attrs.formStepValidity).bind(scope, scope) : scope.$setValidity;

            // Watch the form validity
            scope.$watch(function () {
                return formCtrl.$valid;
            }, function (val) {
                // Check if defined
                if (_angular2.default.isDefined(val)) {
                    validtyChangeCallback(val);
                }
            });
        }
    };
}