uiFormModule.factory('uiFormService', function(){

    var addIsRequiredValidation = function(element) {
        element.setAttribute('required', 'required');
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

    // This will be fetched through meta-data.
    var _messages = {
        required: 'This field is required.',
        number: 'This field should be a numeric field.',
        integer: 'This field should be an integer number.',
        float: 'This field should be an float number.',
        date: 'This should be a valid date field.',
        boolean: 'Should be a boolean',
        minlength: 'This field should be at least %1% characters.',
        maxlength: 'This field should be at most %1% characters.',
        max: 'The maximum value for this field is %1%.',
        min: 'The minimum value for this field is %1%.',
        date: 'This should be a valid date field.',
        pattern: 'This is an incorrect pattern.'
    };

    return {

        /**
         * This method returns a label element, and if required adds the asteriks.
         *
         * @param {Object} configuration
         * {
		 *  label: {String}
		 *  isRequired: {Boolean}
		 * }
         * @returns {Element}
         */
        getLabelElement: function (configuration) {

            // Create the label element and add the label text.
            var labelElement = document.createElement('label');
            labelElement.setAttribute('class', 'control-label col-md-4');

            if ('undefined' != typeof configuration.label) {
                labelElement.appendChild(document.createTextNode(configuration.label));
            }

            return labelElement;
        },

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
        getInputElement: function (name, ngModel, configuration) {

            // Create input element.
            var inputEditModeElement = document.createElement('input');
            inputEditModeElement.setAttribute('type', configuration.type);
            inputEditModeElement.setAttribute('name', name);
            inputEditModeElement.setAttribute('class', 'form-control');

            inputEditModeElement.setAttribute('placeholder', configuration.placeholder);
            inputEditModeElement.setAttribute('data-ng-model', ngModel);
            inputEditModeElement.setAttribute('data-ng-required', configuration.isRequired);

            inputEditModeElement.setAttribute('data-uib-popover', '{{getErrorMessage(\'' + name + '\')}}');
            inputEditModeElement.setAttribute('data-popover-placement', 'bottom');
            inputEditModeElement.setAttribute('data-popover-trigger', 'focus');
            inputEditModeElement.setAttribute('data-popover-enable', '{{getEditMode()}}');

            // Decorate element with validation rules, requirement.
            if (true == configuration.isRequired) {

                addIsRequiredValidation(inputEditModeElement);
            }

            // Decorate element validation rules, minlength.
            if ('undefined' != typeof configuration.minlength && configuration.minlength > 0) {

                addMinLengthValidation(inputEditModeElement, configuration.minlength);
            }

            // Decorate element validation rules, maxlength.
            if ('undefined' != typeof configuration.maxlength && configuration.maxlength > 0) {

                addMaxLengthValidation(inputEditModeElement, configuration.maxlength);
            }

            // Decorate element validation rules, min value. For number and date types only.
            if ('undefined' != typeof configuration.min) {

                addMinValueValidation(inputEditModeElement, configuration.min);
            }

            // Decorate element validation rules, max value. For number and date types only.
            if ('undefined' != typeof configuration.max) {

                addMaxValueValidation(inputEditModeElement, configuration.max);
            }

            // Decorate element validation rules, regex pattern.
            if (configuration.pattern) {

                addPatternValidation(inputEditModeElement, configuration.pattern);
            }

            // Create view mode.
            var inputViewModeElement = document.createElement('p');
            inputViewModeElement.setAttribute('class', 'form-control-static');
            inputViewModeElement.setAttribute('data-ng-bind', ngModel);


            // Create wrapper.
            var inputElementWrapper = document.createElement('div');
            inputElementWrapper.setAttribute('class', 'col-md-8');

            // Append both edit and view mode elements
            inputElementWrapper.appendChild(inputEditModeElement);
            inputElementWrapper.appendChild(inputViewModeElement);

            return inputElementWrapper;
        },

        /**
         * This method fecthes validation message depending on the fields client-side validation rules.
         *
         * @param field {Object} Angular form element.
         * @param formName {String}
         * @param formElementName {String}.
         * @returns {String}
         */
        getMessages: function (field, formName, formElementName) {

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
