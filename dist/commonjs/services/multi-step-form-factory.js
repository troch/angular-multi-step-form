'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = ['$q', '$location', '$rootScope', multiStepForm];

/**
 * @ngdoc       function
 * @name        multiStepForm:multiStepForm
 *
 * @requires    $q
 * @requires    multiStepForm:FormStep
 *
 * @description A service returning an instance per multi step form.
 *              The instance of the service is injected in each step controller.
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
            var searchIndex = void 0;
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