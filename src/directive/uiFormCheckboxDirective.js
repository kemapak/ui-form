uiFormModule.directive('uiFormInputCheckbox', ['uiFormService', function(uiFormService){

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
        template: '<div class="checkbox"></div>', // TODO add the checkbox-inline from config.

        link: function(scope, element, attrs, formController) {

            var labelElement = uiFormService.getLabelElement({label: scope.label, isRequired: scope.config.isRequired});
            element.append(labelElement);

            var checkboxElement = uiFormService.getInputElement(scope.elementName, scope.model, scope.config, formController[scope.editMode]);
            element.append(checkboxElement);

            var ngElement = angular.element(checkboxElement.getElementsByTagName('input')[0]);

            scope.toggleErrorState = function(s) {

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
