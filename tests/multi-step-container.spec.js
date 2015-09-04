describe('multiStepContainer directive:', function() {
    beforeEach(module('multiStepForm'));

    var $rootScope,
        $compile,
        $location,
        $q,
        $log,
        scope;

    var template1 = '<h1>Step 1</h1>',
        template2 = '<h1>Step 2</h1>' +
            '<form name="MyForm" form-step-validity>' +
                '<input type="text" ng-model="model" required />' +
            '</form>';

    beforeEach(inject(function(_$compile_, _$rootScope_, _$location_, $templateCache, _$q_, _$log_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $location = _$location_;
        $q = _$q_;
        $log = _$log_;

        scope = $rootScope.$new();
        scope.steps = [
            {
                title: 'Step 1',
                template: template1
            },
            {
                title: 'Step 2',
                templateUrl: 'tpl/template2.html',
                resolve: {
                    data: [function () {
                        return 'data'
                    }]
                },
                locals: {
                    local: 123
                },
                controller: ['$scope', 'data', 'local', function ($scope, data, local) {
                    $scope.data = data;
                    $scope.local = local;
                }],
                hasForm: true
            }
        ];

        $templateCache.put('tpl/template2.html', template2);
    }));

    function compileDirective(config) {
        var element = angular.element('<multi-step-container steps="steps" />');
        element.append('<main step-container></main>');

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

    it('should throw an error if no step container is supplied', function () {
        var element = angular.element('<multi-step-container steps="steps" />');
        expect(function () {
            $compile(element)(scope);
            $rootScope.$digest();
        }).toThrow();
    });

    it('should warn the user if userFooter is used (migration)', function () {
        var element = angular.element('<multi-step-container steps="steps" use-footer/>')
            .append('<main step-container></main>');
        spyOn($log, 'warn');
        $compile(element)(scope);
        $rootScope.$digest();
        expect($log.warn).toHaveBeenCalled();
    });

    it('should start on the first step by default', function () {
        element = compileDirective();
        expect(element.children().eq(0).html()).toContain('Step 1');
    });

    it('should start on the specified initial step if provided', function () {
        element = compileDirective({initialStep: 2});
        expect(element.children().eq(0).html()).toContain('Step 2');
    });

    it('should have its header augmented with multiStepForm functions', function () {
        element = compileDirective();
        // Go to next
        element.scope().$nextStep();
        scope.$digest();
        expect(element.children().eq(0).html()).toContain('Step 2');
        // Go to previous
        element.scope().$previousStep();
        scope.$digest();
        expect(element.children().eq(0).html()).toContain('Step 1');
        // Go to a specific step
        element.scope().$setActiveIndex(2);
        scope.$digest();
        expect(element.children().eq(0).html()).toContain('Step 2');
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
        expect(element.children().eq(0).html()).toContain('Step 2');
    });

    it('should start with the step provided in URL if no intialStep defined', function () {
        $location.search('multi1', 2);
        $rootScope.$emit('$locationChangeSuccess');
        scope.$digest();
        element = compileDirective({searchId: "'multi1'"});
        expect(element.children().eq(0).html()).toContain('Step 2');
        expect($location.search().multi1).toEqual(2);
    });

    it('should force the initial step to be the one provided to the directive', function () {
        $location.search('multi1', 2);
        element = compileDirective({searchId: "'multi1'", initialStep: 1});
        expect(element.children().eq(0).html()).toContain('Step 1');
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

    it('should have resolved and locals injected in controller', function () {
        element = compileDirective({initialStep: 2});
        expect(element.scope().$$childTail.data).toEqual('data');
        expect(element.scope().$$childTail.local).toEqual(123);
    });

    it('should inform the main directive of a step validity if a form is present', function () {
        element = compileDirective();
        // Go to next
        element.scope().$nextStep();
        scope.$digest();
        // Step should be invalid
        expect(element.scope().$getActiveStep().valid).toBe(false);
        // Change model value to make form valid
        element.scope().model = 'aaa';
        scope.$digest();
        expect(element.scope().$getActiveStep().valid).toBe(true);
    });

    it('should throw an error if a step cannot be loaded', function () {
        scope.steps = [
            {
                title: 'Step 1',
                template: 'Step 1',
                resolve: {
                    data: function () {
                        return $q.reject();
                    }
                }
            }
        ];

        expect(function () {
            compileDirective()
        }).toThrow();
    });

    it('should support controllerAs syntax', function () {
        scope.steps = [
            {
                title: 'Step 1',
                template: 'Step 1',
                controller: function () {
                    this.name = 'name';
                },
                controllerAs: 'step'
            }
        ];
        element = compileDirective();
        expect(element.scope().$$childHead.step.name).toEqual('name');
    });

    it('should invoke a provided callback on transition', function () {
        scope.onStepChange = jasmine.createSpy('onStepChange');
        var element = angular.element('<multi-step-container steps="steps" on-step-change="onStepChange()" />');
        element.append('<main step-container></main>');

        $compile(element)(scope);
        $rootScope.$digest();
        element.scope().$nextStep();
        expect(scope.onStepChange).toHaveBeenCalled();

        element.scope().$nextStep();
        $rootScope.$digest();
        expect(scope.onStepChange.calls.count()).toBe(2);
    });
});
