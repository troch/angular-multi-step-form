describe('multiStepForm factory:', function () {
    var $rootScope,
        steps,
        multiStepForm;

    beforeEach(module('multiStepForm'));

    beforeEach(inject(function(_$rootScope_, _multiStepForm_, FormStep) {
        $rootScope = _$rootScope_;
        // Multi step form factory (function)
        multiStepForm = _multiStepForm_;
        // Create steps using FormStep factory
        steps = [
            {title: 'Step 1', template: 'Step 1'},
            {title: 'Step 2', template: 'Step 2'},
            {title: 'Step 3', template: 'Step 3'},
            {title: 'Step 4', template: 'Step 4'},
            {title: 'Step 5', template: 'Step 5'}
        ].map(function (step) {
            return new FormStep(step);
        });
    }));

    /////////////////////////////////////////////////////////////////
    // Check a new instance is generated each time it is requested //
    /////////////////////////////////////////////////////////////////
    describe('each instance', function () {
        it('should be unique', function () {
            expect(multiStepForm()).not.toBe(multiStepForm());
        });

        it('should have a start function returning a promise', function () {
            expect(typeof multiStepForm().start(steps).then).toEqual('function');
        });

        it('should fail if no steps are provided', function () {
            expect(multiStepForm().start).toThrow();
        });
    });


    ///////////////////////////////////////////////////////
    // Check a multi step form process can be controlled //
    ///////////////////////////////////////////////////////
    describe('once a multi step form instance is started', function () {
        var multiStepFormInstance,
            multiStepFormPromise;

        it('should allow the active step to be set', function () {
            multiStepFormInstance = multiStepForm();
            multiStepFormPromise = multiStepFormInstance.start(steps);
            multiStepFormInstance.setActiveIndex(4);
            expect(multiStepFormInstance.getActiveIndex()).toEqual(4);
        });

        it('can go to the next step within range', function () {
            multiStepFormInstance.nextStep();
            expect(multiStepFormInstance.getActiveIndex()).toEqual(5);
            expect(multiStepFormInstance.isLast()).toBe(true);
            multiStepFormInstance.nextStep();
            expect(multiStepFormInstance.getActiveIndex()).toEqual(5);
        });

        it('can go to the previous step within range', function () {
            multiStepFormInstance.setActiveIndex(2);
            multiStepFormInstance.previousStep();
            expect(multiStepFormInstance.getActiveIndex()).toEqual(1);
            expect(multiStepFormInstance.isFirst()).toBe(true);
            multiStepFormInstance.previousStep();
            expect(multiStepFormInstance.getActiveIndex()).toEqual(1);
        });
    });


});
