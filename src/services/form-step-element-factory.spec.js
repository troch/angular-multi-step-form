describe('formStepElement factory:', function () {
    var $rootScope,
        controller,
        step,
        stepIsolated,
        multiStepForm,
        formStepElement;

    function controllerIsolated (multiStepFormScope) {
        this.multiStepFormScope = multiStepFormScope;
    }

    beforeEach(module('multiStepForm'));

    beforeEach(inject(function(_$rootScope_, _multiStepForm_, FormStep, _formStepElement_) {
        controller = [
            'multiStepFormInstance',
            function (multiStepFormInstance) {
                this.name = "It's me, Mario!";
                this.multiStepFormInstance = multiStepFormInstance;
            }
        ];
        $rootScope = _$rootScope_;
        // To check inheritance
        $rootScope.boolProp = true;
        // Multi step form factory (function)
        multiStepForm = _multiStepForm_;
        // Form step element factory
        formStepElement = _formStepElement_;
        // Create steps using FormStep factory
        step = new FormStep({title: 'Step 1', template: '<h1>Step 1</h1>', controller: controller});
        stepIsolated = new FormStep({title: 'Step 1', template: 'Step 1', isolatedScope: true, controller: controllerIsolated});
    }));

    /////////////////////////////////////////////////////////////////
    // Check an element is generated with the right scope          //
    /////////////////////////////////////////////////////////////////
    describe('the scope of a generated step', function () {
        it('should inherit its parent scope by default', function () {
            var stepScope;

            formStepElement(step, multiStepForm(), $rootScope)
                .then(function (data) {
                    stepScope = data.scope;
                });

            $rootScope.$digest();
            expect(stepScope.boolProp).toBe(true);
        });


        it('should be isolated if specified', function () {
            var stepScope;

            formStepElement(stepIsolated, multiStepForm(), $rootScope)
                .then(function (data) {
                    stepScope = data.scope;
                });

            $rootScope.$digest();
            expect(stepScope.boolProp).toBeUndefined();
        });

        it('should be augmented with multiStepForm instance functions', function () {
            var stepScope;

            formStepElement(step, multiStepForm(), $rootScope)
                .then(function (data) {
                    stepScope = data.scope;
                });

            $rootScope.$digest();
            expect(stepScope.$finish).toBeDefined();
            expect(stepScope.$cancel).toBeDefined();
            expect(stepScope.$nextStep).toBeDefined();
            expect(stepScope.$previousStep).toBeDefined();
        });
    });

    ////////////////////////////////////////////////////////////////////////////
    // Check an element is generated with the right controller and markup     //
    ////////////////////////////////////////////////////////////////////////////
    describe('the markup of a generated step', function () {
        var stepElement;

        it('should be the provided template', function () {
            formStepElement(step, multiStepForm(), $rootScope)
                .then(function (data) {
                    stepElement = data.element;
                });

            $rootScope.$digest();
            expect(stepElement.html()).toEqual('<h1>Step 1</h1>');
        });

        it('should be controlled by the provided controller', function () {
            expect(stepElement.data('$stepController').name).toBe("It's me, Mario!");
        });
    });

    describe('the controller of a generated step', function () {
        var stepElement;

        it('should have the multi step form instance as a dependency', function () {
            formStepElement(step, multiStepForm(), $rootScope)
                .then(function (data) {
                    stepElement = data.element;
                });

            $rootScope.$digest();
            expect(stepElement.data('$stepController').multiStepFormInstance).toBeDefined();
        });

        it('should have its parent scope as a dependency if isolated', function () {
            formStepElement(stepIsolated, multiStepForm(), $rootScope)
                .then(function (data) {
                    stepElement = data.element;
                });

            $rootScope.$digest();
            expect(stepElement.data('$stepController').multiStepFormScope).toBeDefined();
        });
    });
});
