# Configuring steps

## Step properties

Each step is defined with the following properties,
in the same way routes or states are defined in an AngularJS application:

* `controller` (optional)
* `controllerAs`: an identifier name for a reference to the controller in scope
* `template` or `templateUrl` property (required)
* `resolve`
* `locals` (like resolve but a more simple map of key-value pairs)
* `title`
* `hasForm`: whether or not a step contains a form. For example, a confirm or review
  step might not contain a form. This boolean has no influence on how directives behave.
* `data`: an object containing custom data
* `isolatedScope`: whether or not a form step form should be isolated. If isolated,
  the form step scope has still its multiFormContainer as a parent. If isolated,
  the multiStepForm's reference will be available to be injected in the form step's
  controller (`multiStepScope`). Default to false.

## Additional step controller dependencies

The `formStepElement` factory is responsible for creating step elements, instantiating their controllers
and compiling their contents. When a controller is instantiated, two extra dependencies are available
to locally inject:

* `multiStepInstance`: the current instance of `MultiFormStep`.
* `multiStepScope`: the `multiStepContainer` directive scope, if the step's scope is isolated.
