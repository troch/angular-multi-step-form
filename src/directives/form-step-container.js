angular.module('multiStepForm')
/**
 * @ngdoc    directive
 * @name     multiStepForm:formStepContainer
 *
 * @requires multiStepForm:multiStepContainer
 *
 * @restrict A
 * @description The container for form steps. It registers itself with the multi step container.
 *              {@link multiStepForm:multiStepContainer multiStepContainer}
 */
.directive('formStepContainer', [
    function () {
        return {
            restrict: 'A',
            require: '^^multiStepContainer',
            scope: false,
            link: function postLink(scope, element, attrs, multiStepCtrl) {
                multiStepCtrl.setStepContainer(element);
            }
        };
    }
]);
