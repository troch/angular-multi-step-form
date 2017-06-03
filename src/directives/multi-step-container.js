import angular from 'angular';

export default [ '$animate', '$q', '$controller', 'multiStepForm', 'FormStep', 'formStepElement', multiStepContainer ];

/**
 * @ngdoc    directive
 * @name     multiStepForm:multiStepContainer
 *
 * @requires $scope
 * @requires $q
 * @requires $controller
 * @requires multiStepForm:multiStepForm
 * @requires multiStepForm:FormStep
 * @requires multiStepForm:formStepElement
 *
 * @scope
 * @description Multi step directive (overall container)
 */
function multiStepContainer($animate, $q, $controller, multiStepForm, FormStep, formStepElement) {
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
        controller: [
            '$scope',
            function ($scope) {
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
            }
        ],
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
                // Add .multi-step-container class
                element.addClass('multi-step-container');
                // Callbacks
                const onFinish = attrs.onFinish ? resolve(attrs.onFinish) : defaultResolve;
                const onCancel = attrs.onCancel ? resolve(attrs.onCancel) : defaultResolve;
                const onStepChange = attrs.onStepChange ? () => scope.$eval(attrs.onStepChange) : angular.noop;
                // Step container (populated by child post link function)
                const stepContainer = controller.stepContainer;
                const multiStepFormInstance = multiStepForm(scope.$eval(attrs.searchId));

                // Augment scope
                multiStepFormInstance.augmentScope(scope);

                // Controller
                if (attrs.controller) {
                    const customController = $controller(attrs.controller, {
                        $scope: scope,
                        $element: element,
                        multiStepFormInstance
                    });
                    // controllerAs
                    if (attrs.controllerAs) {
                        scope[attrs.controllerAs] = customController;
                    }
                }

                // Initial step
                const initialStep = scope.$eval(attrs.initialStep);

                let currentLeaveAnimation,
                    currentEnterAnimation,
                    currentStepScope,
                    currentStepElement,
                    isDeferredResolved = false;

                // Resolve any outstanding promises on destroy
                scope.$on('$destroy', () => {
                    if (!isDeferredResolved) {
                        isDeferredResolved = true;
                        multiStepFormInstance.deferred.reject();
                    }
                });

                // Initialise and start the multi step form
                multiStepFormInstance
                    .start(scope.formSteps)
                    .then(onFinish, onCancel, function (data) {
                        const step = data.newStep;
                        const previousStep = data.oldStep;
                        const direction = angular.isDefined(previousStep) ?
                                   (step < previousStep  ? 'step-backward' : 'step-forward') :
                                   'step-initial';

                        const formStep = scope.formSteps[step - 1];
                            // Create new step element (promise)
                        const newStepElement = formStepElement(formStep, multiStepFormInstance, scope);

                        // Add direction class to the parent container;
                        stepContainer
                            .removeClass('step-forward step-backward step-initial')
                            .addClass(direction);

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
                        newStepElement
                            .then(function (step) {
                                onStepChange(step);
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

                // Default resolution function
                function defaultResolve() {
                    $animate.leave(element);
                    isDeferredResolved = true;
                    scope.$destroy();
                }

                // On promise resolution
                function resolve(fn) {
                    return function() {
                        isDeferredResolved = true;
                        scope.$eval(fn);
                    };
                }
            }
        }
    };
}
