# Scopes

The `multiStepContainer` directive scope (the top directive to use) and step scopes are all augmented with the following methods:

- `$isFirst()`: whether the current step is the first step or not
- `$isLast()`: whether the current step is the last step or not
- `$cancel()`: to cancel the current multi step form / wizard
- `$finish()`: to finish the current multi step form / wizard
- `$getActiveIndex()`: return the index of the active step (start with 1)
- `$getActiveStep()`: return the active step object
- `$getSteps()`: return the list of step objects
- `$nextStep()`: go to the next step
- `$previousStep()`: return to the previous step
- `$setActiveIndex()`: navigate to a specific step
- `$setValidity(validity, stepIndex)`: set validity of the specified step (current step if no given step)

## Isolated step scope

By default, step scopes inherit from the top directive scope (which itself inherits from its view scope).
You can configure steps to have an isolate scope by setting the `isolatedScope` property to true. An isolated scope
will still be augmented with the helpers described above.

When a step has an isolated scope, `multiStepFormScope` can be injected into your controller, in order to be
able to access data from outside your step. See [saving data example](http://blog.reactandbethankful.com/angular-multi-step-form/#/saving-data).
