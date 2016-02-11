uiFormModule.directive('uiFormInputCheckbox', ['$compile', 'uiFormService', 'uiFormValidationService', function($compile, uiFormService, uiFormValidationService){

    return {
        restrict: 'E',
        transclude: false,
        replace: true,
        require: '^form',
        scope: {
            elementName: '@?',
            label: '=?',
            config: '=?',
            flush: '=?'
        },
        template: '<div class="form-group"></div>',

        link: function(scope, element, attrs, formController) {

            if ('undefined' ==  typeof scope.config) {
                scope.config = {};
            }

            if ('undefined' ==  typeof scope.config.type) {
                scope.config.type = 'text';
            }

            if ('undefined' ==  typeof scope.config.isRequired) {
                scope.config.isRequired = false;
            }

            if ('undefined' == typeof scope.elementName) {
                scope.elementName = 'elementName_' + Math.random(new Data().getMilliseconds());
            }

            if ('undefined' == typeof scope.flush) {

                scope.flush = false;
            }

            if ('undefined' == typeof scope.label) {

               scope.label = '';
            }

            var labelElement = document.createElement('label');

            var checkboxEditModeElement = uiFormService.getCheckbox({
                name: scope.elementName,
                ngModel: attrs.ngModel});
            checkboxEditModeElement = uiFormValidationService.setValidationRules(checkboxEditModeElement, scope.config);
            checkboxEditModeElement = uiFormValidationService.setErrorPopover(checkboxEditModeElement);
            labelElement.appendChild(checkboxEditModeElement);

            labelElement.appendChild(document.createTextNode(scope.label));

            var checkboxViewModeElement = uiFormService.getCheckboxViewMode({label: scope.label, ngModel: attrs.ngModel});

            var checkboxWrapperElement = uiFormService.getWrapperElement({type: scope.config.type, layout: scope.config.layout});

            var elementGridSize = ' col-sm-offset-4 col-sm-8';

            if (true == scope.flush) {

                elementGridSize = ' col-sm-12';
            }

            checkboxWrapperElement.setAttribute('class', checkboxWrapperElement.getAttribute('class') + elementGridSize);

            checkboxWrapperElement.appendChild(labelElement);
            checkboxWrapperElement.appendChild(checkboxViewModeElement);

            element.append(checkboxWrapperElement);

            var ngElement = angular.element(checkboxEditModeElement);

            // TODO error state is very funky in checkboxes. Try to find a workaround.
            //scope.toggleErrorState = function() {
            //
            //    if (formController[scope.elementName].$dirty && formController[scope.elementName].$invalid) {
            //        element.addClass('has-error');
            //    } else {
            //        element.removeClass('has-error');
            //    }
            //}
            //
            //ngElement.bind('blur, click', function() {
            //
            //    scope.toggleErrorState();
            //});

            $compile(element.contents())(scope.$parent);
        }
    };

}]);
