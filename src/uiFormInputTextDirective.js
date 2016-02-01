uiFormModule.directive('uiFormInputText', ['$compile', 'uiFormService', function($compile, uiFormService){

	return {
		restrict: 'E',
		transclude: true,
		replace: true,
		require: '^form',
		scope: {
			elementName: '@',
			config: '=',
			message: '@'
		},
		template: '<div class="form-group"></div>',

		link: function(scope, element, attrs, formController) {

			var labelElement = uiFormService.getLabelElement({label: scope.config.label, isRequired: scope.config.isRequired});
			element.append(labelElement);

			var inputElement = uiFormService.getInputElement(scope.elementName, attrs.ngModel, scope.config, formController[scope.editMode]);
			element.append(inputElement);

			var ngElement = angular.element(inputElement.getElementsByTagName('input')[0]);

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
