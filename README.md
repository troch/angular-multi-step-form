[![Build Status](https://travis-ci.org/troch/angular-multi-step-form.svg?branch=master)](https://travis-ci.org/troch/angular-multi-step-form)
[![Coverage Status](https://coveralls.io/repos/troch/angular-multi-step-form/badge.svg?branch=master)](https://coveralls.io/r/troch/angular-multi-step-form?branch=master)

# Angular Multi step form

`multiStepForm` is an angular module to create multi step forms and wizards. Create your steps like your would
create your views with ngRoute or ui-router!

It is lightweight (6kb minified) but extremely versatile and powerful.


## Requirements

- Angular 1.3+


## Features

- Steps are controlled views and are easily configured
- Asynchronous loading of steps (`templateUrl` and `resolve`)
- Forward and backward animations
- Isolated or non isolated scopes for steps
- Track step validity if it contains a form
- `onCancel` and `onFinish` callbacks
- Browser navigation with search URL parameter
- You decide what level of control you expose to the user: next, previous, jump to state, finish, cancel, etc...
- Place summary, controls, etc... in header or footer
- Support for multiple components per view


## Examples

- [Getting started](http://blog.reactandbethankful.com/angular-multi-step-form/#/getting-started)
- [Using forms](http://blog.reactandbethankful.com/angular-multi-step-form/#/using-forms)
- [Saving data](http://blog.reactandbethankful.com/angular-multi-step-form/#/saving-data)
- [CSS transitions](http://blog.reactandbethankful.com/angular-multi-step-form/#/css-transitions)
- [Cancel and Finish](http://blog.reactandbethankful.com/angular-multi-step-form/#/cancel-finish)
- [Browser navigation](http://blog.reactandbethankful.com/angular-multi-step-form/#/browser-navigation)


## Docs

- [Configuring your steps](./docs/configuring-steps.md)
- [The multiStepContainer directive](./docs/multi-step-container.md)
- [Steps and directive scopes](./docs/scopes.md)
- [Multi step form instance object](./docs/multi-step-instance.md)
- [Animations, navigation, callbacks](./docs/steps-lifecycle.md)
- [Advanced guide](./docs/advanced-guide.md)


## Getting started

Grab the sources with bower or download from Github: [https://github.com/troch/angular-multi-step-form/tree/master/dist](./dist):

```sh
$ bower install --save-dev angular-multi-step-form
```

Include the `multiStepForm` module in your app:

```javascript
angular.module('yourApp', [
    'multiStepForm'
]);
```

You can then configure your steps

```javascript
$scope.steps = [
    {
        template: 'Hello <button class="btn btn-default" ng-click="$nextStep()">Next</button>'
    },
    {
        template: 'World <button class="btn btn-default" ng-click="$previousStep()">Previous</button>'
    }
];
```

And start your multiple step form / wizard:

```html
<multi-step-container steps="yourSteps">
```
