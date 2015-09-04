# Steps lifecycle

## Step transitions

Animations can be performed using the following classes

* `ng-enter` or `ng-leave` (see https://docs.angularjs.org/api/ngAnimate/service/$animate#enter
  and https://docs.angularjs.org/api/ngAnimate/service/$animate#leave)
* A  class is added to the `multi-step-body` element: `step-initial` for the first step being rendered,
  and `step-forward` or `step-backward` thereafter depending on the "direction".

The entering and leaving animations are performed simutaneously (the leaving animation can be delayed
if data or template need to be resolved). If you want separate animation, introduce a delay in your CSS.
attribute for avoiding it.

## Navigation

By supplying a search ID to the `multiStepContainer` directive, navigation will be enabled:

    <multi-step-container steps="yourSteps" search-id="'id1'">

The example above will add the search parameter 'id1' to your URL (`you_url?id1=`).
When initialising a view, the initialStep property has the priority over an already defined
search parameter, allowing you to having total control over a manually entered URL when starting
the form.

## Callbacks

Callbacks can be supplied to the multiStepContainer directive.

    <multi-step-container steps="yourSteps"
        on-cancel="onCancel()" on-finish="onFinish()" on-step-change="onStepChange()">

* `onCancel` attribute: the provided callback will be invoked when the multi step form is cancelled
* `onFinish` attribute: the provided callback will be invoked when the multi step form is finished
* `onStepChange` attribute: the provided callback will be invoked on each step change

By default, the directive element and its scope are destroyed on cancel and on finish. If you want
to navigate away from the current view, you need to supply onCancel and onFinish callbacks.
