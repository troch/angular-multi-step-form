'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = FormStep;

/**
 * @ngdoc       object
 * @name        multiStepForm:FormStep
 *
 * @description A constructor for creating form steps
 * @error       If no template or templateUrl properties are supplied
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