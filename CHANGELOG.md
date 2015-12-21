<a name="1.2.5"></a>
## [1.2.5](https://github.com/troch/angular-multi-step-form/compare/v1.2.4...v1.2.5) (2015-12-21)


### Bug Fixes

* Fix dev dependency issue with gulp ([6216723](https://github.com/troch/angular-multi-step-form/commit/6216723))



<a name"1.2.4"></a>
### 1.2.4 (2015-11-11)


#### Bug Fixes

* set main file configuration in bower package to non minified version ([a5e55ba9](https://github.com/troch/angular-multi-step-form/commit/a5e55ba9))


<a name"1.2.3"></a>
### 1.2.3 (2015-11-11)


#### Bug Fixes

* annotate distributed sources ([6d8a4c04](https://github.com/troch/angular-multi-step-form/commit/6d8a4c04))


<a name"1.2.2"></a>
### 1.2.2 (2015-11-08)


#### Bug Fixes

* fix assignment of custom data to steps ([b2707ad8](https://github.com/troch/angular-multi-step-form/commit/b2707ad8))


#### Features

* use ES6 modules for npm package. Main bower file is now in `dist/browser` and not `dist` ([9deeee20](https://github.com/troch/angular-multi-step-form/commit/9deeee20))


<a name"1.2.0"></a>
## 1.2.0 (2015-09-04)


#### Features

* add 'onStepChange' callback ([d9c188b7](https://github.com/troch/angular-multi-step-form/commit/d9c188b7))


<a name"1.1.2"></a>
### 1.1.2 (2015-09-04)


#### Features

* scroll to top of form set container on step change ([72cca503](https://github.com/troch/angular-multi-step-form/commit/72cca503))


<a name="1.1.0"></a>
## 1.1.0 (2015-06-19)


#### Bug Fixes

* remove ngAnimate dependency ([6bf652e5](https://github.com/troch/angular-multi-step-form/commit/6bf652e5))


#### Features

* add support for both header and footer. ([e80b944d](https://github.com/troch/angular-multi-step-form/commit/e80b944d), closes [#2](https://github.com/troch/angular-multi-step-form/issues/2))


#### Breaking Changes

* prior to this, there could only be a header or a footer. Now there can be both, as long as an element with the `stepContainer` directive is inside the `multiStepContainer` directive. See [migration guide](./docs/migrating-to-1.1.x.md)

Fixes #2

 ([e80b944d](https://github.com/troch/angular-multi-step-form/commit/e80b944d))



<a name="1.1.0"></a>
## 1.1.0 (2015-06-19)



<a name="1.0.5"></a>
### 1.0.5 (2015-06-17)


#### Features

* **controllerAs:** support controllerAs syntax for steps ([9568676f](https://github.com/troch/angular-multi-step-form/commit/9568676f), closes [#1](https://github.com/troch/angular-multi-step-form/issues/1))


<a name="1.0.4"></a>
### 1.0.4 (2015-06-16)


#### Bug Fixes

* **navigation:** replace current location with searchId when loading first step ([546ae30b](https://github.com/troch/angular-multi-step-form/commit/546ae30b))


#### Features

* **MultiStepForm:** add getSteps() method, add it to scopes (`$getSteps()`) ([72504619](https://github.com/troch/angular-multi-step-form/commit/72504619))


<a name="1.0.3"></a>
### 1.0.3 (2015-06-16)


#### Bug Fixes

* **multiStepContainer:** remove step-initial class before transition ([1570290f](https://github.com/troch/angular-multi-step-form/commit/1570290f))

#### Features

* **multiStepContainer:** use `main` rather than `article` in HTML template ([ba9680f](https://github.com/troch/angular-multi-step-form/commit/ba9680f))

<a name="1.0.2"></a>
### 1.0.2 (2015-06-14)


#### Features

* **multiStepContainer:** add support for `use-footer` attribute to transclude in footer rather than in header ([269855d](https://github.com/troch/angular-multi-step-form/commit/269855d))


<a name="1.0.1"></a>
### 1.0.1 (2015-06-12)


<a name="1.0.0"></a>
### 1.0.0 (2015-06-12)
