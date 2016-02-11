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
