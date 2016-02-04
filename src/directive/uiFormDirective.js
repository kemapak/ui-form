uiFormModule.directive('uiForm', ['uiFormService', 'uiFormValidationService', '$compile', function (uiFormService, uiFormValidationService, $compile) {

    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        controller: function(){},

        template: '<ng-form novalidate data-ng-transclude></ng-form>',

        link: function (scope, element, attrs) {

            element.addClass('ui-form');

            scope.formName = attrs.name;

            scope.editMode = attrs.editMode;

            scope.getErrorMessage = function(formElementName) {

                if ('undefined' == typeof this[this.formName][formElementName]) {
                    return;
                }

                var field = this[this.formName][formElementName];


                return uiFormValidationService.getValidationMessages(field, this.formName, formElementName);
            }

            scope.getEditMode = function() {

                return uiFormService.getEditMode(this.editMode);
            }

            scope.getCheckboxViewClass = function(status) {

                return uiFormService.getCheckboxViewClass(status);
            }

            element.on('$destroy', function () {
                // Nothing to do yet.
            });

            $compile(element.contents())(scope);
        }
    }
}]);
