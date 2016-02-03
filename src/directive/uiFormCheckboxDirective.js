uiFormModule.directive('uiFormInputCheckbox', ['uiFormService', 'uiFormValidationService', function(uiFormService, uiFormValidationService){

    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        require: '^form',
        scope: {
            elementName: '@',
            model: '=ngModel',
            label: '=',
            config: '=',
            message: '@'
        },
        template: '<div class="form-group"></div>',

        link: function(scope, element, attrs, formController) {

            //var labelElement = uiFormService.getLabel({label: scope.label, isRequired: scope.config.isRequired, gridSize: ''});
            var labelElement = document.createElement('label');
            //labelElement.setAttribute('class', 'control-label');

            var checkboxEditModeElement = uiFormService.getCheckbox(scope.elementName, attrs.ngModel, scope.config);
            checkboxEditModeElement = uiFormValidationService.setValidationRules(checkboxEditModeElement, scope.config);
            labelElement.appendChild(checkboxEditModeElement);

            var checkboxViewModeElement = uiFormService.getCheckboxViewMode(attrs.ngModel);
            labelElement.appendChild(checkboxViewModeElement);

            labelElement.appendChild(document.createTextNode(scope.label));

            var checkboxWrapperElement = uiFormService.getWrapperElement({type: scope.config.type, layout: scope.config.layout, gridSize: scope.config.gridSize});
            checkboxWrapperElement.appendChild(labelElement);

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
        }
    };

}]);
