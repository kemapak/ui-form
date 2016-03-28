uiFormModule.directive('uiFormInputText', ['$compile', 'uiFormService', 'uiFormValidationService', function($compile, uiFormService, uiFormValidationService){

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
				scope.elementName = 'elementName_' + Math.random(new Date().getMilliseconds());
			}

            if ('undefined' == typeof scope.flush) {

                scope.flush = false;
            }

            if (false == scope.flush && 'undefined' != typeof scope.label) {

                var labelElement = uiFormService.getLabel({label: scope.label, isRequired: scope.config.isRequired});
                element.append(labelElement);
            }

			var inputEditModeElement = uiFormService.getText({
                name: scope.elementName,
                type: scope.config.type,
                placeholder: scope.config.placeholder,
                ngModel: attrs.ngModel});
            inputEditModeElement = uiFormValidationService.setValidationRules(inputEditModeElement, scope.config);
            inputEditModeElement = uiFormValidationService.setErrorPopover(inputEditModeElement);


            var inputViewModeElement = uiFormService.getTextViewMode(attrs.ngModel);

			var inputWrapperElement = uiFormService.getWrapperElement({type: scope.config.type, layout: scope.config.layout});
			inputWrapperElement.appendChild(inputEditModeElement);
			inputWrapperElement.appendChild(inputViewModeElement);

            var elementGridSize = ' col-sm-8';

            if (true == scope.flush || 'undefined' == typeof scope.label) {

                elementGridSize = ' col-sm-12';
            }
            inputWrapperElement.setAttribute('class', inputWrapperElement.getAttribute('class') + elementGridSize);

			element.append(inputWrapperElement);

			var ngElement = angular.element(inputEditModeElement);

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
