uiFormModule.directive('uiFormInputCheckbox', ['$compile', 'uiFormService', 'uiFormValidationService', function($compile, uiFormService, uiFormValidationService){

    return {
        restrict: 'E',
        transclude: false,
        replace: true,
        require: '^form',
        scope: {
            elementName: '@',
            label: '=',
            config: '=',
            message: '@'
        },
        template: '<div class="form-group"></div>',

        link: function(scope, element, attrs, formController) {

            var labelElement = document.createElement('label');

            var checkboxEditModeElement = uiFormService.getCheckbox(scope.elementName, attrs.ngModel, scope.config);
            checkboxEditModeElement = uiFormValidationService.setValidationRules(checkboxEditModeElement, scope.config);
            labelElement.appendChild(checkboxEditModeElement);

            labelElement.appendChild(document.createTextNode(scope.label));

            var checkboxViewModeElement = uiFormService.getCheckboxViewMode(scope.label, attrs.ngModel);

            var checkboxWrapperElement = uiFormService.getWrapperElement({type: scope.config.type, layout: scope.config.layout, gridSize: scope.config.gridSize});
            checkboxWrapperElement.appendChild(labelElement);
            checkboxWrapperElement.appendChild(checkboxViewModeElement);

            element.append(checkboxWrapperElement);

            var ngElement = angular.element(checkboxEditModeElement);

            scope.toggleErrorState = function() {

                if (formController[scope.elementName].$dirty && formController[scope.elementName].$invalid) {
                    element.addClass('has-error');
                } else {
                    element.removeClass('has-error');
                }
            }

            ngElement.bind('keyup', function() {

                scope.toggleErrorState();
            });

            $compile(element.contents())(scope.$parent);
        }
    };

}]);
