uiFormModule.factory('uiFormValidationService', ['$http', function($http){

    var _messages = {};

    $http.get('../src/validationMessages.bundle.JSON').then(function(response) {
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
