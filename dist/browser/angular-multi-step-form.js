(function (angular) {
"use strict";


/**
 * @ngdoc    directive
 * @name     multiStepForm:formStepValidity
 *
 * @restrict A
 * @description Notify the multi step form instance of a change of validity of a step.
 *              This directive can be used on a form element or within a form.
 *
 * @ngInject
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
                if (angular.isDefined(val)) {
                    validtyChangeCallback(val);
                }
            });
        }
    };
}
formStepValidity.$inject = ["$parse"];


/**
 * @ngdoc    directive
 * @name     multiStepForm:multiStepContainer
 *
 * @requires $scope
 * @requires multiStepForm:multiStepForm
 * @requires multiStepForm:FormStep
 * @requires multiStepForm:formStepElement
 *
 * @scope
 * @description Multi step directive (overall container)
 *
 * @ngInject
 */
function multiStepContainer($animate, $q, $log, multiStepForm, FormStep, formStepElement) {
    return {
        restrict: 'EA',
        scope: true,
        /**
         * @ngdoc    controller
         * @name     multiStepForm:MultiStepFormCtrl
         *
         * @requires $scope
         * @requires multiStepForm:multiStepForm
         *
         * @description Controls a multi step form and track progress.
         */
        controller: ['$scope', function ($scope) {
            /**
             * @ngdoc    function
             * @methodOf multiStepForm:MultiStepFormCtrl
             *
             * @description Register the step container element. This method
             *              is invoked in the post link function of directive
             *              {@link multiStepForm:formStepContainer formStepContainer}
             * @param {JQLite} elm The step form container
             */
            this.setStepContainer = function (elm) {
                this.stepContainer = elm;
            };
        }],
        link: {
            pre: function preLink(scope, element, attrs) {
                /**
                 * @ngdoc       property
                 * @propertyOf  multiStepForm:MultiStepFormContainer
                 * @description The form steps
                 * @type  {FormStep[]}
                 */
                scope.formSteps = scope.$eval(attrs.steps).map(function (step) {
                    return new FormStep(step);
                });

                /**
                 * @ngdoc       property
                 * @propertyOf  multiStepForm:MultiStepFormContainer
                 * @description The form step titles
                 * @type  {String[]}
                 */
                scope.stepTitles = scope.formSteps.map(function (step) {
                    return step.title;
                });
            },
            post: function postLink(scope, element, attrs, controller) {
                function destroy() {
                    $animate.leave(element);
                    scope.$destroy();
                }
                // Check that a step container has been defined
                if (attrs.useFooter !== undefined) {
                    $log.warn('useFooter attribute is no longer supported. Instead you need to define were you want your steps to be added.');
                }
                if (controller.stepContainer === undefined) {
                    $log.warn('You need to define a step container, using the stepContainer directive (element and attribute supported).');
                    $log.warn('See changelog: https://github.com/troch/angular-multi-step-form/blob/master/CHANGELOG.md');
                    $log.warn('See migration guide: https://github.com/troch/angular-multi-step-form/blob/master/docs/migrating-to-1.1.x.md');
                    throw new Error('Step container not found');
                }
                // Add .multi-step-container class
                element.addClass('multi-step-container');
                // Callbacks
                var onFinish = attrs.onFinish ? function () {
                    return scope.$eval(attrs.onFinish);
                } : destroy;
                var onCancel = attrs.onCancel ? function () {
                    return scope.$eval(attrs.onCancel);
                } : destroy;
                var onStepChange = attrs.onStepChange ? function () {
                    return scope.$eval(attrs.onStepChange);
                } : angular.noop;
                // Step container (populated by child post link function)
                var stepContainer = controller.stepContainer;
                var multiStepFormInstance = multiStepForm(scope.$eval(attrs.searchId));
                // Initial step
                var initialStep = scope.$eval(attrs.initialStep);

                var currentLeaveAnimation = undefined,
                    currentEnterAnimation = undefined,
                    currentStepScope = undefined,
                    currentStepElement = undefined;

                // Augment scope
                multiStepFormInstance.augmentScope(scope);

                // Initialise and start the multi step form
                multiStepFormInstance.start(scope.formSteps).then(onFinish, onCancel, function (data) {
                    var step = data.newStep;
                    var previousStep = data.oldStep;
                    var direction = angular.isDefined(previousStep) ? step < previousStep ? 'step-backward' : 'step-forward' : 'step-initial';

                    var formStep = scope.formSteps[step - 1];
                    // Create new step element (promise)
                    var newStepElement = formStepElement(formStep, multiStepFormInstance, scope);

                    // Add direction class to the parent container;
                    stepContainer.removeClass('step-forward step-backward step-initial').addClass(direction);

                    // Cancel current leave animation if any
                    if (currentLeaveAnimation) {
                        $animate.cancel(currentLeaveAnimation);
                    }
                    // Cancel current enter animation if any
                    if (currentEnterAnimation) {
                        $animate.cancel(currentEnterAnimation);
                    }
                    // Destroy current scope
                    if (currentStepScope) {
                        currentStepScope.$destroy();
                    }
                    // Leave current step if any
                    if (currentStepElement) {
                        currentLeaveAnimation = $animate.leave(currentStepElement);
                    }
                    // Enter new step when new step element is ready
                    newStepElement.then(function (step) {
                        onStepChange();
                        currentStepScope = step.scope;
                        currentStepElement = step.element;
                        currentStepElement.scrollTop = 0;
                        stepContainer.scrollTop = 0;
                        currentEnterAnimation = $animate.enter(currentStepElement, stepContainer);
                    }, function () {
                        throw new Error('Could not load step ' + step);
                    });
                });

                // Initialise currentStep
                multiStepFormInstance.setInitialIndex(initialStep);
            }
        }
    };
}
multiStepContainer.$inject = ["$animate", "$q", "$log", "multiStepForm", "FormStep", "formStepElement"];


/**
 * @ngdoc    directive
 * @name     multiStepForm:stepContainer
 *
 * @requires multiStepForm:stepContainer
 *
 * @restrict A
 * @description The container for form steps. It registers itself with the multi step container.
 *              {@link multiStepForm:multiStepContainer multiStepContainer}
 *
 * @ngInject
 */
function stepContainer() {
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


/**
 * @ngdoc   function
 * @name    multiStepForm:formStepElement
 *
 * @requires $rootScope
 * @requires $controller
 *
 * @description A factory function for creating form step elements
 *              (using controller, template and resolve)
 *
 * @ngInject
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
            return angular.isFunction(formStep.template) || angular.isArray(formStep.template) ? $injector.$invoke(formStep.template) : formStep.template;
        }
        // Use templateUrl
        var templateUrl =
        // If function or array, use $injector to get templateUrl value
        angular.isFunction(formStep.templateUrl) || angular.isArray(formStep.templateUrl) ? $injector.$invoke(formStep.templateUrl) : formStep.templateUrl;
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
        var formStepElement = angular.element('<div>').addClass('form-step');

        var controller = undefined,
            template = undefined,
            promisesHash = {};

        // Get template
        promisesHash.$template = resolveTemplate(formStep);

        // Get resolve
        angular.forEach(formStep.resolve, function (resolveVal, resolveName) {
            promisesHash[resolveName] =
            // angular.isString(resolveVal) ?
            // $injector.get(resolveVal) :
            $injector.invoke(resolveVal);
        });

        // After all locals are resolved (template and "resolves") //
        return $q.all(promisesHash).then(function (locals) {
            // Extend formStep locals with resolved locals
            locals = angular.extend({}, formStep.locals, locals);
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
formStepElement.$inject = ["$compile", "$controller", "$http", "$injector", "$q", "$templateCache"];


/**
 * @ngdoc       object
 * @name        multiStepForm:FormStep
 *
 * @description A constructor for creating form steps
 * @error       If no template or templateUrl properties are supplied
 *
 * @ngInject
 */
function FormStep() {
  return function FormStep(config) {
    if (!config.template && !config.templateUrl) {
      throw new Error('Either template or templateUrl properties have to be provided for' + ' multi step form' + config.title);
    }

    /**
     * @ngdoc       property
     * @propertyOf  multiStepForm:FormStep
     *
     * @description The form step title
     * @type {String}
     */
    this.title = config.title;

    /**
     * @ngdoc       property
     * @propertyOf  multiStepForm:FormStep
     *
     * @description The form step additional data
     * @type {Object}
     */
    this.data = config.data || {};

    /**
     * @ngdoc       property
     * @propertyOf  multiStepForm:FormStep
     *
     * @description The form step controller
     * @type {String|Function|Array}
     */
    this.controller = config.controller;

    /**
     * @ngdoc       property
     * @propertyOf  multiStepForm:FormStep
     *
     * @description An identifier name for a reference to the controller
     * @type {String}
     */
    this.controllerAs = config.controllerAs;

    /**
     * @ngdoc       property
     * @propertyOf  multiStepForm:FormStep
     *
     * @description The form step template
     * @type {String}
     */
    this.template = config.template;

    /**
     * @ngdoc       property
     * @propertyOf  multiStepForm:FormStep
     *
     * @description The form step template URL
     * @type {String}
     */
    this.templateUrl = config.templateUrl;

    /**
     * Whether or not the form step should have an isolated scope
     * @type {Boolean}
     */
    this.isolatedScope = config.isolatedScope || false;

    /**
     * @ngdoc       property
     * @propertyOf  multiStepForm:resolve
     *
     * @description The form step resolve map (same use than for routes)
     * @type {Object}
     */
    this.resolve = config.resolve || {};

    /**
     * @ngdoc       property
     * @propertyOf  multiStepForm:resolve
     *
     * @description The form step locals map (same than resolve but for non deferred values)
     *              Note: resolve also works with non deferred values
     * @type {Object}
     */
    this.locals = config.locals || {};

    /**
     * @ngdoc       property
     * @propertyOf  multiStepForm:FormStep
     *
     * @description Whether or not this form step contains a form
     * @type {Boolean}
     */
    this.hasForm = config.hasForm || false;

    /**
     * @ngdoc       property
     * @propertyOf  multiStepForm:FormStep
     *
     * @description Whether or not this form step is valid.
     *              Form validity can been fed back using a specific directive.
     *              {@link multiStepForm:formStepValidity formStepValidity}
     * @type {Boolean}
     */
    this.valid = false;

    /**
     * @ngdoc       property
     * @propertyOf  multiStepForm:FormStep
     *
     * @description Whether or not this step has been visited
     *              (i.e. the user has moved to the next step)
     * @type {Boolean}
     */
    this.visited = false;
  };
}


/**
 * @ngdoc       function
 * @name        multiStepForm:multiStepForm
 *
 * @requires    $q
 * @requires    multiStepForm:FormStep
 *
 * @description A service returning an instance per multi step form.
 *              The instance of the service is injected in each step controller.
 *
 * @ngInject
 */
function multiStepForm($q, $location, $rootScope) {
    function MultiFormStep(searchId) {
        var _this = this;

        /**
         * @ngdoc       property
         * @propertyOf  multiStepForm:multiStepForm
         *
         * @description The location search property name to store the active step index.
         * @type {String}
         */
        this.searchId = searchId;
        // If the search id is defined,
        if (angular.isDefined(searchId)) {
            $rootScope.$on('$locationChangeSuccess', function (event) {
                var searchIndex = parseInt($location.search()[_this.searchId]);

                if (!isNaN(searchIndex) && _this.activeIndex !== searchIndex) {
                    // Synchronise
                    _this.setActiveIndex(parseInt(searchIndex));
                }
            });
        }

        /**
         * @ngdoc       property
         * @propertyOf  multiStepForm:multiStepForm
         *
         * @description The form steps
         * @type {Array}
         */
        this.steps = [];

        /**
         * @ngdoc       property
         * @propertyOf  multiStepForm:multiStepForm
         *
         * @description Return the form steps
         * @return {Array}
         */
        this.getSteps = function () {
            return this.steps;
        };

        /**
         * @ngdoc       property
         * @propertyOf  multiStepForm:multiStepForm
         *
         * @description The multi-step form deferred object
         * @type {Deferred}
         */
        this.deferred = $q.defer();

        /**
         * @ngdoc         method
         * @methodOf      multiStepForm:multiStepForm
         *
         * @description   Initialise the form steps and start
         * @error         If no steps are provided
         * @param  {Array}   steps The form steps
         * @return {Promise} A promise which will be resolved when all steps are passed,
         *                   and rejected if the user cancel the multi step form.
         */
        this.start = function (steps) {
            if (!steps || !steps.length) {
                throw new Error('At least one step has to be defined');
            }
            // Initialise steps
            this.steps = steps;
            // Return promise
            return this.deferred.promise;
        };

        /**
         * @ngdoc       method
         * @methodOf    multiStepForm:multiStepForm
         *
         * @description Cancel this multi step form
         * @type {Array}
         */
        this.cancel = function () {
            this.deferred.reject('cancelled');
        };

        /**
         * @ngdoc       method
         * @methodOf    multiStepForm:multiStepForm
         *
         * @description Finish this multi step form (success)
         */
        this.finish = function () {
            this.deferred.resolve();
        };

        /**
         * @ngdoc       method
         * @methodOf    multiStepForm:multiStepForm
         *
         * @description Return the multi form current step
         * @return {Number} The active step index (starting at 1)
         */
        this.getActiveIndex = function () {
            return this.activeIndex;
        };

        /**
         * @ngdoc       method
         * @methodOf    multiStepForm:multiStepForm
         *
         * @description Initialise the multi step form instance with
         *              an initial index
         * @param {Number} step The index to start with
         */
        this.setInitialIndex = function (initialStep) {
            var searchIndex = undefined;
            // Initial step in markup has the priority
            // to override any manually entered URL
            if (angular.isDefined(initialStep)) {
                return this.setActiveIndex(initialStep);
            }
            // Otherwise use search ID if applicable
            if (this.searchId) {
                searchIndex = parseInt($location.search()[this.searchId]);
                if (!isNaN(searchIndex)) {
                    return this.setActiveIndex(searchIndex);
                }
            }
            // Otherwise set to 1
            this.setActiveIndex(1);
        };

        /**
         * @ngdoc       method
         * @methodOf    multiStepForm:multiStepForm
         *
         * @description Set the current step to the provided value and notify
         * @param {Number} step The step index (starting at 1)
         */
        this.setActiveIndex = function (step) {
            if (this.searchId) {
                // Update $location
                if (this.activeIndex) {
                    $location.search(this.searchId, step);
                } else {
                    // Replace current one
                    $location.search(this.searchId, step).replace();
                }
            }
            // Notify deferred object
            this.deferred.notify({
                newStep: step,
                oldStep: this.activeIndex
            });
            // Update activeIndex
            this.activeIndex = step;
        };

        /**
         * @ngdoc       method
         * @methodOf    multiStepForm:multiStepForm
         *
         * @description Return the active form step object
         * @return {FormStep} The active form step
         */
        this.getActiveStep = function () {
            if (this.activeIndex) {
                return this.steps[this.activeIndex - 1];
            }
        };

        /**
         * @ngdoc       method
         * @methodOf    multiStepForm:multiStepForm
         *
         * @description Check if the current step is the first step
         * @return {Boolean} Whether or not the current step is the first step
         */
        this.isFirst = function () {
            return this.activeIndex === 1;
        };

        /**
         * @ngdoc       method
         * @methodOf    multiStepForm:multiStepForm
         *
         * @description Check if the current step is the last step
         * @return {Boolean} Whether or not the current step is the last step
         */
        this.isLast = function () {
            return this.activeIndex === this.steps.length;
        };

        /**
         * @ngdoc       method
         * @methodOf    multiStepForm:multiStepForm
         *
         * @description Go to the next step, if not the last step
         */
        this.nextStep = function () {
            if (!this.isLast()) {
                this.setActiveIndex(this.activeIndex + 1);
            }
        };

        /**
         * @ngdoc       method
         * @methodOf    multiStepForm:multiStepForm
         *
         * @description Go to the next step, if not the first step
         */
        this.previousStep = function () {
            if (!this.isFirst()) {
                this.setActiveIndex(this.activeIndex - 1);
            }
        };

        /**
         * @ngdoc       method
         * @methodOf    multiStepForm:multiStepForm
         *
         * @description Go to the next step, if not the first step
         */
        this.setValidity = function (isValid, stepIndex) {
            var step = this.steps[(stepIndex || this.activeIndex) - 1];

            if (step) {
                step.valid = isValid;
            }
        };

        /**
         * @ngdoc       method
         * @methodOf    multiStepForm:multiStepForm
         *
         * @description Augment a scope with useful methods from this object
         * @param {Object} scope The scope to augment
         */
        this.augmentScope = function (scope) {
            var _this2 = this;

            ['cancel', 'finish', 'getActiveIndex', 'setActiveIndex', 'getActiveStep', 'getSteps', 'nextStep', 'previousStep', 'isFirst', 'isLast', 'setValidity'].forEach(function (method) {
                scope['$' + method] = _this2[method].bind(_this2);
            });
        };
    }

    return function multiStepFormProvider(searchId) {
        return new MultiFormStep(searchId);
    };
}
multiStepForm.$inject = ["$q", "$location", "$rootScope"];


/**
 * @ngdoc module
 * @name  multiStepForm
 */
var multiStepFormModule = angular.module('multiStepForm', [/*'ngAnimate'*/]);

multiStepFormModule.directive('formStepValidity', formStepValidity).directive('multiStepContainer', multiStepContainer).directive('stepContainer', stepContainer).factory('formStepElement', formStepElement).factory('FormStep', FormStep).factory('multiStepForm', multiStepForm);
}(angular));
