# Multi-step form instance object

For each multi-step form rendered, there is an associated Object which is an instance of `MultiFormStep`.

It can be injected in step controllers: `multiStepFormInstance`

```javascript
myApp.controller('MyStepCtrl', [
    '$scope',
    'multiStepFormInstance',
    function ($scope, multiStepFormInstance) {
        /* ... */
    }
])
```

## API

<a name="steps"></a>
`multiStepFormInstance.steps`  
 _Array[FormSteps]_: The list of configured steps.

<a name="cancel"></a>
`multiStepFormInstance.cancel()`  
Call the provided `onCancel` callback or destroy the multi-step form component.

<a name="finish"></a>
`multiStepFormInstance.finish()`  
Call the provided `onFinish` callback or destroy the multi-step form component.

<a name="getActiveIndex"></a>
`multiStepFormInstance.getActiveIndex()`  
Return the current step index (starting at 1).

<a name="setActiveIndex"></a>
`multiStepFormInstance.setActiveIndex(step)`  
Set the active step to the provided index (starting at 1).

<a name="getActiveStep"></a>
`multiStepFormInstance.getActiveStep()`  
Return the current step (`FormStep` Object).

<a name="getSteps"></a>
`multiStepFormInstance.getSteps()`  
Return the list of steps (`FormStep[]`)

<a name="isFirst"></a>
`multiStepFormInstance.isFirst()`  
Return true if the current step is the first step, false otherwise.

<a name="isLast"></a>
`multiStepFormInstance.isLast()`  
Return true if the current step is the last step, false otherwise.

<a name="nextStep"></a>
`multiStepFormInstance.nextStep()`  
Navigate to the next step.

<a name="previousStep"></a>
`multiStepFormInstance.previousStep()`  
Navigate to the previous step.

<a name="setValidity"></a>
`multiStepFormInstance.setValidity(isValid[, stepIndex])`
Set the validity of the current step (or of the specified step index).
