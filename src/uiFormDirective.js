uiFormModule.directive('uiForm', ['uiFormService', '$compile', function (uiFormService, $compile) {

    return {
        restrict: 'E',
        transclude: true,
        replace: true,

        template: '<ng-form novalidate data-ng-transclude></ng-form>',

        link: function (scope, element, attrs) {

            element.addClass('ui-form');

            scope.formName = attrs.name;

            scope.editMode = attrs.editMode;

            scope.getErrorMessage = function(formElementName) {

                if ('undefined' == this[this.formName][formElementName]) {
                    return;
                }

                var field = this[this.formName][formElementName];


                return uiFormService.getMessages(field, this.formName, formElementName);


            }

            scope.getEditMode = function() {

                return uiFormService.getEditMode(this.editMode);
            }

            element.on('$destroy', function () {
                // Nothing to do yet.
            });

            $compile(element.contents())(scope);
        }
    }
}]);
