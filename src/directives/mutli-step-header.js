angular.module('multiStepForm')
/**
 * @ngdoc    directive
 * @name     multiStepForm:multiStepHeader
 *
 * @requires multiStepForm:multiStepContainer
 *
 * @restrict A
 * @description The header for form steps. It registers itself with the multi step container.
 *              {@link multiStepForm:multiStepContainer multiStepContainer}
 */
.directive('multiStepHeader', [
    function () {
        return {
            restrict: 'A',
            require: '^^multiStepContainer',
            scope: false,
            link: function postLink(scope, element, attrs, multiStepCtrl) {
                multiStepCtrl.setMultiStepHeader(element);
            }
        };
    }
]);
