angular.module('multiStepForm')
/**
 * @ngdoc    directive
 * @name     multiStepForm:stepContainer
 *
 * @requires multiStepForm:stepContainer
 *
 * @restrict A
 * @description The container for form steps. It registers itself with the multi step container.
 *              {@link multiStepForm:multiStepContainer multiStepContainer}
 */
.directive('stepContainer', [
    function () {
        return {
            restrict: 'EA',
            require: '^^multiStepContainer',
            scope: false,
            link: function postLink(scope, element, attrs, multiStepCtrl) {
                element.addClass('multi-step-body');
                multiStepCtrl.setStepContainer(element);
            }
        };
    }
]);
