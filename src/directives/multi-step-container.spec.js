describe('multiStepContainer directive:', function() {
    beforeEach(module('multiStepForm'));

    var $rootScope,
        $compile,
        $location,
        scope;

    var template1 = '<h1>Step 1</h1>',
        template2 = '<h1>Step 2</h1>';

    beforeEach(inject(function(_$compile_, _$rootScope_, _$location_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $location = _$location_;

        scope = $rootScope.$new();
        scope.steps = [
            {
                title: 'Step 1',
                template: template1
            },
            {
                title: 'Step 2',
                template: template2
            }
        ];
    }));

    function compileDirective(config) {
        var element = angular.element('<multi-step-container steps="steps" />');

        if (angular.isString(config)) {
            element.append(config);
        }
        if (angular.isObject(config)) {
            if (config.html) {
                element.append(config.html);
            }
            if (config.initialStep) {
                element.attr('initial-step', config.initialStep);
            }
            if (config.searchId) {
                element.attr('search-id', config.searchId);
            }
        }

        $compile(element)(scope);
        $rootScope.$digest();

        return element;
    }

    it('should start on the first step by default', function () {
        element = compileDirective();
        expect(element.children().eq(1).html()).toContain(template1);
    });

    it('should start on the specified initial step if provided', function () {
        element = compileDirective({initialStep: 2});
        expect(element.children().eq(1).html()).toContain(template2);
    });

    it('should have its content transcluded into its header', function() {
        element = compileDirective('Multi step form header');
        expect(element.children().eq(0).html()).toContain('Multi step form header');
    });

    it('should have its header augmented with multiStepForm functions', function () {
        element = compileDirective();
        // Go to next
        element.scope().$nextStep();
        scope.$digest();
        expect(element.children().eq(1).html()).toContain(template2);
        // Go to previous
        element.scope().$previousStep();
        scope.$digest();
        expect(element.children().eq(1).html()).toContain(template1);
        // Go to a specific step
        element.scope().$setActiveIndex(2);
        scope.$digest();
        expect(element.children().eq(1).html()).toContain(template2);
    });

    it('should update the location if a search ID is provided', function () {
        element = compileDirective({searchId: "'multi1'"});
        expect($location.search().multi1).toEqual(1);
    });

    it('should navigate to the desired step if the location search ID is modified', function () {
        element = compileDirective({searchId: "'multi1'"});
        $location.search('multi1', 2);
        $rootScope.$emit('$locationChangeSuccess');
        scope.$digest();
        expect(element.children().eq(1).html()).toContain(template2);
    });

    it('should force the initial step to be the one provided to the directive', function () {
        $location.search('multi1', 2);
        element = compileDirective({searchId: "'multi1'", initialStep: 1});
        expect(element.children().eq(1).html()).toContain(template1);
        expect($location.search().multi1).toEqual(1);
    });

    it('should destroy itself when cancelled', function () {
        element = compileDirective();
        element.scope().$cancel();
        scope.$digest();
        expect(element.scope()).toBeUndefined();
    });

    it('should destroy itself when finished', function () {
        element = compileDirective();
        element.scope().$finish();
        scope.$digest();
        expect(element.scope()).toBeUndefined();
    });
});
