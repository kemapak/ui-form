uiFormModule = angular.module('uiFormModule', []);

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
                scope.elementName = 'elementName_' + Math.random(new Date().getMilliseconds());
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

uiFormModule.directive('uiFormTextarea', ['$compile', 'uiFormService', 'uiFormValidationService', function($compile, uiFormService, uiFormValidationService){

    return {
        restrict: 'E',
        transclude: false,
        replace: true,
        require: '^form',
        scope: {
            elementName: '@?',
            label: '=?',
            config: '=?',
            flush: '=?',
            editMode: '=?'
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

uiFormModule.value('validationMessages', {

    "required": "This field is required.",
    "number": "This field should be a numeric field.",
    "integer": "This field should be an integer number.",
    "float": "This field should be an float number.",
    "date": "This should be a valid date field.",
    "boolean": "Should be a boolean",
    "minlength": "This field should be at least %1% characters.",
    "maxlength": "This field should be at most %1% characters.",
    "max": "The maximum value for this field is %1%.",
    "min": "The minimum value for this field is %1%.",
    "pattern": "This is an incorrect pattern."
});

uiFormModule.factory('uiFormService', ['$parse', function($parse){

    /**
     * Supported input "text" types (checkbox and radio are different directives).
     *
     * @type {string[]}
     * @private
     */
    _supportedInputTextTypes = ['text', 'password', 'hidden', 'email', 'number', 'date'];

    /**
     * This method creates an input element wrapped inside a sizable container.
     *
     * @private
     */
    _getFormElement = function(type) {

        // Create input element by default. This will the most used option.
        var element = document.createElement('input');

        switch (type) {
            case 'textarea':
                element = document.createElement('textarea');
            case 'select':
                element = document.createElement('select');
            default:
                element.setAttribute('type', type);
                break;
        }

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

            var cssClass = 'control-label col-sm-4';

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

        /**
         *
         * @param {Object} configuration
         * {
         *  name: {String} Element name for validation, etc.
         *  type: {String) Input type, for example: "text", "email", etc.
         *  placeholder: {String} Placeholder text.
         *  ngModel: {Object} ngModel.
         * }
         * @returns {DOMElement}
         */
        getText: function (configuration) {

            var element = _getFormElement(configuration.type);

            element.setAttribute('name', configuration.name);
            element.setAttribute('data-ng-model', configuration.ngModel);

            element.setAttribute('class', 'form-control');
            if ('undefined' != typeof configuration.placeholder) {
                element.setAttribute('placeholder', configuration.placeholder);
            }

            return element;
        },

        getTextViewMode: function (ngModel) {

            var element = document.createElement('p');
            element.setAttribute('class', 'form-control-static');
            element.setAttribute('data-ng-bind', ngModel);
            element.setAttribute('title', '{{' + ngModel + '}}');

            return element;
        },

        /**
         *
         * @param {Object} configuration
         * {
         *  name: {String} Element name for validation, etc.,
         *  placeholder: {String} Placeholder text.,
         *  ngModel: {Object} ngModel.
         * }
         * @returns {DOMElement}
         */
        getTextarea: function (configuration) {

            var element = _getFormElement('textarea');

            element.setAttribute('data-ng-model', configuration.ngModel);

            element.setAttribute('class', 'form-control');
            if ('undefined != typeof configuration.placeholder') {
                element.setAttribute('placeholder', configuration.placeholder);
            }

            element = _setErrorPopover(configuration.name, element);

            return element;
        },

        getTextareaViewMode: function(ngModel) {
            return this.getTextViewMode(ngModel);
        },

        /**
         *
         * @param {Object} configuration
         * {
         *  name: {String} Element name for validation, etc.
         *  ngModel: {String} ngModel.
         * }
         * @returns {DOMElement}
         */
        getCheckbox: function (configuration) {

            var element = _getFormElement('checkbox');

            element.setAttribute('name', configuration.name);
            element.setAttribute('data-ng-model', configuration.ngModel);

            return element;
        },

        /**
         *
         * @param configuration
         * {
         *  label: {String}
         *  ngModel: {String} ngModel
         * }
         * @returns {Element}
         */
        getCheckboxViewMode: function(configuration) {

            var element = document.createElement('p');
            element.setAttribute('class', 'form-control-static');
            element.appendChild(document.createTextNode(configuration.label));
            element.setAttribute('title', configuration.label);

            element.setAttribute('data-ng-class', 'getCheckboxViewClass(' + configuration.ngModel + ')');

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
            element.setAttribute('class', typeClass);

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
}]);

uiFormModule.factory('uiFormValidationService', ['validationMessages', function(validationMessages){

    var _messages = validationMessages;

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

        setErrorPopover: function(element) {

            element.setAttribute('data-uib-popover', '{{getErrorMessage(\'' + element.getAttribute('name') + '\')}}');
            element.setAttribute('data-popover-placement', 'bottom');
            element.setAttribute('data-popover-trigger', 'focus');
            element.setAttribute('data-popover-enable', '{{getEditMode()}}');

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
