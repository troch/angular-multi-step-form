'use strict';

angular.module('multiStepForm')
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
 */
.directive('multiStepContainer', [
    '$animate',
    '$parse',
    '$q',
    'multiStepForm',
    'FormStep',
    'formStepElement',
    function ($animate, $parse, $q, multiStepForm, FormStep, formStepElement) {
        return {
            restrict: 'EA',
            templateUrl: 'multi-step-form/partials/multi-step-container.html',
            scope: true,
            replace: true,
            transclude: true,
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

                    /**
                     * @ngdoc    function
                     * @methodOf multiStepForm:MultiStepFormCtrl
                     *
                     * @description Register the multi step header element. This method
                     *              is invoked in the post link function of directive
                     *              {@link multiStepForm:multiStepHeader multiStepHeader}
                     * @param {JQLite} elm The multi step header
                     */
                    this.setMultiStepHeader = function (elm) {
                        this.multiStepHeader = elm;
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
                post: function postLink(scope, element, attrs, controller, $transclude) {
                    function destroy() {
                        $animate.leave(element);
                        scope.$destroy();
                    }
                    // Callbacks
                    var onFinish = attrs.onFinish ? $parse(attrs.onFinish).bind(scope, scope) : destroy,
                        onCancel = attrs.onCancel ? $parse(attrs.onCancel).bind(scope, scope) : destroy;
                    // Step container (populated by child post link function)
                    var stepContainer = controller.stepContainer,
                        multiStepFormInstance = multiStepForm(scope.$eval(attrs.searchId)),
                        // Initial step
                        initialStep = scope.$eval(attrs.initialStep);

                    var currentLeaveAnimation,
                        currentEnterAnimation,
                        currentStepScope,
                        currentStepElement;

                    // Augment scope
                    multiStepFormInstance.augmentScope(scope);

                    // Initialise and start the multi step form
                    multiStepFormInstance
                        .start(scope.formSteps)
                        .then(onFinish, onCancel, function (data) {
                            var step = data.newStep,
                                previousStep = data.oldStep,
                                direction = angular.isDefined(previousStep) ?
                                       (step < previousStep  ? 'step-backward' : 'step-forward') :
                                       'step-initial';

                            var formStep = scope.formSteps[step - 1],
                                // Create new step element (promise)
                                newStepElement = formStepElement(formStep, multiStepFormInstance, scope);

                            // Add direction class to the parent container;
                            stepContainer
                                .removeClass('step-forward step-backward')
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
                                .then(function (data) {
                                    currentStepScope = data.scope;
                                    currentStepElement = data.element;
                                    currentEnterAnimation = $animate.enter(currentStepElement, stepContainer);
                                }, function () {
                                    throw new Error('Could not load step ' + step);
                                });
                        });

                        // Initialise currentStep
                        multiStepFormInstance.setInitialIndex(initialStep);

                    // Handle transclusion manually to avoid
                    // creation of a sibling scope
                    $transclude(scope, function(clone) {
                        controller.multiStepHeader.empty();
                        controller.multiStepHeader.append(clone);
                    });
                }
            }
        };

    }
]);
