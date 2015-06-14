# How it works

The `multiStepContainer` directive is the starting point. Each `multiStepContainer` has its own instance
of a `MultiStepForm` object (provided by the `multiStepForm` factory) which provide controls such has: start,
nextStep, previousStep, finish, cancel, etc...

Form step elements are created with the help of the `formStepElement` factory. Each form step controller
(if provided) gets the MultiStepForm instance of its container available to inject (dependency is called
`multiStepFormInstance`). In addition, each form step scope is augmented with the following functions
from its multiStepFormInstance (with a `$` prefix): `MultiStepForm.cancel()`, `MultiStepForm.finish()`,
`MultiStepForm.getActiveIndex()`, `MultiStepForm.setActiveIndex()`, `MultiStepForm.getActiveStep()`,
`MultiStepForm.nextStep()`, `MultiStepForm.previousStep()` and `MultiStepForm.setValidity()`.

Each MultiStepForm object has a start method which is invoked by the multiStepContainer directive
in its postLink function. It returns a promise for avoiding an inversion of control:

* If the `MultiStepForm.cancel()` method is called, the promise is rejected and the onCancel
  callback is executed.
* If the `MultiStepForm.finish()` method is called, the promise is resolved and the onFinish
  callback is executed.
* The promise receives a notification each time there is a step change. The current form step
  element is destroyed and a new one is created.


