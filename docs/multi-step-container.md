# The `multiStepContainer` directive

## Attributes

```html
<multi-step-container steps="steps"
                      on-finish="finish()"
                      on-cancel="cancel()"
                      search-id="'wizard-id'"
                      initial-step="1"
                      controller="MyCustomController">
    <step-container></step-container>
</multi-step-container>
```

`steps` _angular expression_
The list of steps.

`initialStep` _angular expression_
The starting step.

`searchId` _angular expression_
The name of the search parameter to use (enables browser navigation).

`onFinish`  _angular expression_
The expression to execute if the multi-step form is finished.

`onCancel`  _angular expression_
The expression to execute if the multi-step form is cancelled.

`onStepChange`  _angular expression_
The expression to execute on a step change.

`controller`  _string_
The name of a controller. `multiStepFormInstance` can be injected.

`controllerAs` _string_
For your custom controller.

## Class names

The following class names are added:
- `.multi-step-container` to the top directive element
- `.multi-step-body` to the `stepContainer` directive element
- `.form-step` to the step element

```html
<multi-step-container class="multi-step-container">
    <step-container class="multi-step-body">
        <div class="form-step">
            <!-- The current step -->
        </div>
    </step-container>
</multi-step-container>
```
