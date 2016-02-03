uiFormModule.directive('uiFormInputText', ['uiFormService', 'uiFormValidationService', function(uiFormService, uiFormValidationService){

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

			var labelElement = uiFormService.getLabel({label: scope.label, isRequired: scope.config.isRequired, gridSize: scope.config.labelGridSize});
			element.append(labelElement);

			var inputEditModeElement = uiFormService.getText(scope.elementName, attrs.ngModel, scope.config);
			inputEditModeElement = uiFormValidationService.setValidationRules(inputEditModeElement, scope.config)
			element.append(inputEditModeElement);


			var inputViewModeElement = uiFormService.getTextViewMode(attrs.ngModel);
			element.append(inputViewModeElement);

			var inputWrapperElement = uiFormService.getWrapperElement({type: scope.config.type, layout: scope.config.layout, gridSize: scope.config.valueGridSize});
			inputWrapperElement.appendChild(inputEditModeElement);
			inputWrapperElement.appendChild(inputViewModeElement);
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
		}
	};

}]);
