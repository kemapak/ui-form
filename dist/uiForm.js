uiFormModule = angular.module('uiFormModule', []);

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

            //$compile(element.contents())(scope);
        }
    }
}]);

uiFormModule.directive('uiFormFieldset', [function(){

    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        require: '^form',
        template: '<fieldset data-ng-transclude></fieldset>',

        link: function(scope, element, attrs) {

            if ('undefined' != attrs.legend) {

                var legendElement = document.createElement('legend');
                legendElement.appendChild(document.createTextNode(attrs.legend));

                element.append(legendElement);
            }
        }
    };

}]);

uiFormModule.directive('uiFormInputText', ['$compile', 'uiFormService', 'uiFormValidationService', function($compile, uiFormService, uiFormValidationService){

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

			var labelElement = uiFormService.getLabel({label: scope.label, isRequired: scope.config.isRequired, gridSize: scope.config.labelGridSize});
			element.append(labelElement);

			var inputEditModeElement = uiFormService.getText(scope.elementName, attrs.ngModel, scope.config);
			inputEditModeElement = uiFormValidationService.setValidationRules(inputEditModeElement, scope.config);

			var inputViewModeElement = uiFormService.getTextViewMode(attrs.ngModel);

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

            $compile(element.contents())(scope.$parent);
		}
	};

}]);

uiFormModule.factory('uiFormService', function(){

    /**
     * This method creates an input element wrapped inside a sizable container.
     *
     * @param {Object} configuration
     * {
     *  name: {String}
     *  type: {String} Supports, text, hidden, password, email, url // TODO Convert to enum.
     *  isReuired: {Boolean}
     *  minlength: {Number}
     *  maxlength: {Number}
     *  pattern: {RegEx}
     * }
     */
    _getFormElement = function (name, ngModel, configuration) {

        // Create input element.
        var element = document.createElement('input');
        element.setAttribute('type', configuration.type);
        element.setAttribute('name', name);
        element.setAttribute('data-ng-model', ngModel);

        return element;
    };

    _setErrorPopover = function(name, element) {

        element.setAttribute('data-uib-popover', '{{getErrorMessage(\'' + name + '\')}}');
        element.setAttribute('data-popover-placement', 'bottom');
        element.setAttribute('data-popover-trigger', 'focus');
        element.setAttribute('data-popover-enable', '{{getEditMode()}}');

        return element;
    };

    return {

        /**
         * This method returns a label element, and if required adds the asteriks.
         *
         * @param {Object} labelConfiguration
         * {
		 *  label: {String}
		 *  isRequired: {Boolean}
		 *  gridSize: {String} Grid size converted to boostrap units.
		 * }
         * @returns {Element}
         */
        getLabel: function (labelConfiguration) {

            // Create the label element and add the label text.
            var labelElement = document.createElement('label');

            var cssClass = 'control-label';

            if ('undefined' != typeof labelConfiguration.gridSize) {

                cssClass += ' ' + labelConfiguration.gridSize;
            }

            labelElement.setAttribute('class', cssClass);

            if ('undefined' != typeof labelConfiguration.label) {
                labelElement.appendChild(document.createTextNode(labelConfiguration.label));
            }

            if (labelConfiguration.isRequired) {

                labelElement.setAttribute('data-ng-required', 'true');

                // Create a wrapper for the required asterisk icon to make it small.
                var requiredIconWrapper = document.createElement('sup');

                // Create required icon via bootstrap convention.
                var requiredIcon = document.createElement('span');
                requiredIcon.setAttribute('class', 'glyphicon glyphicon-asterisk text-danger');

                // Add icon to the wrapper.
                requiredIconWrapper.appendChild(requiredIcon);

                // Add wrapper to the label.
                labelElement.appendChild(requiredIconWrapper);
            }

            return labelElement;
        },

        getText: function (name, ngModel, configuration) {

            var element = _getFormElement(name, ngModel, configuration);
            element.setAttribute('class', 'form-control');
            if ('undefined != typeof configuration.placeholder') {
                element.setAttribute('placeholder', configuration.placeholder);
            }

            element = _setErrorPopover(name, element);

            return element;
        },

        getTextViewMode: function (ngModel) {

            var element = document.createElement('p');
            element.setAttribute('class', 'form-control-static');
            element.setAttribute('data-ng-bind', ngModel);
            element.setAttribute('title', '{{' + ngModel + '}}');

            return element;
        },

        getTextarea: function (name, ngModel, configuration) {

            var element = _getFormElement(name, ngModel, configuration);
            element.setAttribute('class', 'form-control');
            element.setAttribute('placeholder', configuration.placeholder);

            return element;
        },

        getTextareaViewMode: function(ngModel) {
            return this.getTextViewMode(ngModel);
        },

        getCheckbox: function (name, ngModel, configuration) {

            var element = _getFormElement(name, ngModel, configuration);

            return element;
        },

        getCheckboxViewMode: function(label, ngModel) {

            var element = document.createElement('p');
            element.setAttribute('class', 'form-control-static');
            element.appendChild(document.createTextNode(label));
            element.setAttribute('title', '{{' + ngModel + '}}');

            element.setAttribute('data-ng-class', 'getCheckboxViewClass(' + ngModel + ')');

            return element;
        },

        getCheckboxViewClass: function(status) {

            var cssClass = '';

            if (!status) {

                cssClass = 'hide';
            }

            return cssClass;
        },

        getRadio: function (name, ngModel, configuration) {

            var element = _getFormElement(name, ngModel, configuration);

            return element;
        },

        getRadioViewMode: function(ngModel) {

            return document.createTextNode('TODO radio view mode');
        },

        getSelect: function (name, ngModel, configuration) {

            var element = _getFormElement(name, ngModel, configuration);

            return element;
        },

        /**
         *
         * @param wrapperConfiguration  {Object} Layout configuration.
         * {
         *   type: form element type (input, textarea, select, checkbox, radio)
         *   layout: none or inline (for boostrap checkbox-inline, radio-inline)
         *   gridSize: Bootstrap grid size. (for example: col-sm-6)
         * }
         *
         * @returns {Element}
         */
        getWrapperElement: function(wrapperConfiguration) {

            var element = document.createElement('div');

            var typeClass = '';

            switch (wrapperConfiguration.type) {
                case 'checkbox': {

                    typeClass = 'checkbox';
                    if (('undefined' !== typeof wrapperConfiguration.layout) && ('inline' == wrapperConfiguration.layout)) {
                        typeClass += '-inline';
                    }
                    break;
                }
                case 'radio': {

                    typeClass = 'radio';
                    if ((undefined !== typeof wrapperConfiguration.layout) && ('inline' == wrapperConfiguration.layout)) {
                        typeClass += '-inline';
                    }
                    break;
                }
                case 'input':
                case 'textarea':
                case 'select':
                default: {
                    break;
                }
            }

            // For input, textarea, select use bootstrap 'form-group'
            element.setAttribute('class', typeClass + ' ' + wrapperConfiguration.gridSize);

            return element;
        },

        /**
         * This method returns the state of edit mode.
         *
         * @param isEditable {Boolean}
         * @returns {Boolean}
         */
        getEditMode: function (isEditable) {

            // We are getting the param as String!
            if ('undefined' == typeof(isEditable) || 'false' == isEditable) {

                return false;
            } else {

                return true;
            }
        }
    }
});

uiFormModule.factory('uiFormValidationService', ['$http', function($http){

    var _messages = {};

    $http.get('validationMessages.bundle.json').then(function(response) {
        _messages = response.data;
    });

    var addIsRequiredValidation = function(element) {
        element.setAttribute('data-ng-required', 'true');
    };

    var addMinLengthValidation = function(element, value) {
        element.setAttribute('data-ng-minlength', value);
    };

    var addMaxLengthValidation = function(element, value) {
        element.setAttribute('data-ng-maxlength', value);
    };

    var addMinValueValidation = function(element, value) {
        element.setAttribute('min', value);
    };

    var addMaxValueValidation = function(element, value) {
        element.setAttribute('max', value);
    };

    var addPatternValidation = function(element, regex) {
        element.setAttribute('data-ng-pattern', regex);
    };

    return {


        /**
         * This method creates an input element wrapped inside a sizable container.
         *
         * @param {Object} configuration
         * {
		 *  name: {String}
		 *  type: {String} Supports, text, hidden, password, email, url // TODO Convert to enum.
		 *  isReuired: {Boolean}
		 *  minlength: {Number}
		 *  maxlength: {Number}
		 *  pattern: {RegEx}
		 * }
         */
        setValidationRules: function (element, configuration) {

            // Decorate element with validation rules, requirement.
            if (true == configuration.isRequired) {

                addIsRequiredValidation(element);
            }

            // Decorate element validation rules, minlength.
            if ('undefined' != typeof configuration.minlength && configuration.minlength > 0) {

                addMinLengthValidation(element, configuration.minlength);
            }

            // Decorate element validation rules, maxlength.
            if ('undefined' != typeof configuration.maxlength && configuration.maxlength > 0) {

                addMaxLengthValidation(element, configuration.maxlength);
            }

            // Decorate element validation rules, min value. For number and date types only.
            if ('undefined' != typeof configuration.min) {

                addMinValueValidation(element, configuration.min);
            }

            // Decorate element validation rules, max value. For number and date types only.
            if ('undefined' != typeof configuration.max) {

                addMaxValueValidation(element, configuration.max);
            }

            // Decorate element validation rules, regex pattern.
            if (configuration.pattern) {

                addPatternValidation(element, configuration.pattern);
            }

            return element;
        },

        /**
         * This method fecthes validation message depending on the fields client-side validation rules.
         *
         * @param field {Object} Angular form element.
         * @param formName {String}
         * @param formElementName {String}.
         * @returns {String}
         */
        getValidationMessages: function (field, formName, formElementName) {

            var message = '\u2714';

            if (('undefined' == typeof(field)) || field.$valid || field.$pristine) {
                return message;
            }

            if (('undefined' == typeof(formName)) || ('undefined' == typeof(formElementName))) {
                return message;
            }

            if ('undefined' == typeof(document.getElementsByName(formName))) {
                return message;
            }

            if ('undefined' == typeof(document.getElementsByName(formElementName))) {
                return message;
            }

            var element = document.getElementsByName(formName)[0].querySelectorAll('*[name=' + formElementName + ']');

            message = '\u2718';

            if (field.$error.required) {
                message += ' -' + _messages.required;
            }
            if (field.$error.number) {
                message += ' -' + _messages.number;
            }
            if (field.$error.boolean) {
                message += ' -' + _messages.boolean;
            }
            if (field.$error.date) {
                message += ' -' + _messages.date;
            }
            if (field.$error.minlength) {
                message += ' -' + _messages.minlength.replace('%1%', element[0].getAttribute('data-ng-minlength'));
            }
            if (field.$error.maxlength) {
                message += ' -' + _messages.maxlength.replace('%1%', element[0].getAttribute('data-ng-maxlength'));
            }
            if (field.$error.min) {
                message += ' -' + _messages.min.replace('%1%', element[0].getAttribute('min'));
            }
            if (field.$error.max) {
                message += ' -' + _messages.max.replace('%1%', element[0].getAttribute('max'));
            }
            if (field.$error.pattern) {
                message += ' -' + _messages.pattern;
            }

            return message;
        }
    }
}]);
