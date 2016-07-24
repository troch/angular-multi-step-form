'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = ['$compile', '$controller', '$http', '$injector', '$q', '$templateCache', formStepElement];

/**
 * @ngdoc   function
 * @name    multiStepForm:formStepElement
 *
 * @requires $rootScope
 * @requires $controller
 *
 * @description A factory function for creating form step elements
 *              (using controller, template and resolve)
 */

function formStepElement($compile, $controller, $http, $injector, $q, $templateCache) {
    /**
     * Resolve the template of a form step
     * @param  {FormStep} formStep The form step object
     * @return {Promise|String}    A promise containing the template
     */
    function resolveTemplate(formStep) {
        if (formStep.template) {
            // If function or array, use $injector to get template value
            return _angular2.default.isFunction(formStep.template) || _angular2.default.isArray(formStep.template) ? $injector.$invoke(formStep.template) : formStep.template;
        }
        // Use templateUrl
        var templateUrl =
        // If function or array, use $injector to get templateUrl value
        _angular2.default.isFunction(formStep.templateUrl) || _angular2.default.isArray(formStep.templateUrl) ? $injector.$invoke(formStep.templateUrl) : formStep.templateUrl;
        // Request templateUrl using $templateCache
        return $http.get(templateUrl, { cache: $templateCache });
    }

    /**
     * Create a new scope with the multiStepContainer being the parent scope.
     * augmented with multi step form control methods.
     * @param  {FormStep} formStep The form step object
     * @param  {FormStep} formStep The form step object
     * @return {Object} The form step scope
     */
    function getScope(scope, formStep, multiStepFormInstance) {
        var stepScope = scope.$new(formStep.isolatedScope);
        // Augment scope with multi step form instance methods
        multiStepFormInstance.augmentScope(stepScope);

        return stepScope;
    }

    /**
     * Create a form step element, compiled with controller and dependencies resolved
     *
     * @param  {FormStep} formStep            The form step object
     * @param  {Object} multiStepFormInstance The multi step form instance
     * @param  {Object} multiStepFormScope    The scope instance of the multi step form
     * @return {Promise}                      A promise containing the form step element
     */
    return function formStepElementFactory(formStep, multiStepFormInstance, multiStepFormScope) {
        var formStepElement = _angular2.default.element('<div>').addClass('form-step');

        var controller = void 0,
            template = void 0,
            promisesHash = {};

        // Get template
        promisesHash.$template = resolveTemplate(formStep);

        // Get resolve
        _angular2.default.forEach(formStep.resolve, function (resolveVal, resolveName) {
            promisesHash[resolveName] =
            // angular.isString(resolveVal) ?
            // $injector.get(resolveVal) :
            $injector.invoke(resolveVal);
        });

        // After all locals are resolved (template and "resolves") //
        return $q.all(promisesHash).then(function (locals) {
            // Extend formStep locals with resolved locals
            locals = _angular2.default.extend({}, formStep.locals, locals);
            // Load template inside element
            locals.$template = locals.$template.data || locals.$template;
            formStepElement.html(locals.$template);
            // Create scope
            var formStepScope = getScope(multiStepFormScope, formStep, multiStepFormInstance);

            if (formStep.controller) {
                // Create form step scope
                locals.$scope = formStepScope;
                // Add multi step form service instance to local injectables
                locals.multiStepFormInstance = multiStepFormInstance;
                // Add multi step form scope to local injectables if isolated
                if (formStep.isolatedScope) {
                    locals.multiStepFormScope = multiStepFormScope;
                }
                // Instanciate controller
                controller = $controller(formStep.controller, locals);
                // controllerAs
                if (formStep.controllerAs) {
                    formStepScope[formStep.controllerAs] = controller;
                }
                formStepElement.data('$stepController', controller);
                // formStepElement.children().data('$ngControllerController', controller);
            }

            // Compile form step element and link with scope
            $compile(formStepElement)(formStepScope);

            // Return element and scope
            return {
                element: formStepElement,
                scope: formStepScope
            };
        });
    };
}