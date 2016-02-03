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
    }

    return {

        /**
         * This method returns a label element, and if required adds the asteriks.
         *
         * @param {Object} labelConfiguration
         * {
		 *  label: {String}
		 *  isRequired: {Boolean}
		 *  gridSize: {String} Grid size converted to boostrap units
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

            var element = getFormElement(name, ngModel, configuration);
            element.setAttribute('class', 'form-control');
            element.setAttribute('placeholder', configuration.placeholder);

            return element;
        },

        getTextareViewMode: function(ngModel) {
            return this.getTextViewMode(ngModel);
        },

        getCheckbox: function (name, ngModel, configuration) {

            var element = getFormElement(name, ngModel, configuration);

            return element;
        },

        getCheckboxViewMode: function(ngModel) {

            return 'TODOcheckbox view mode';
        },

        getRadio: function (name, ngModel, configuration) {

            var element = getFormElement(name, ngModel, configuration);

            return element;
        },

        getRadioViewMode: function(ngModel) {

            return 'TODO radio view mode';
        },

        getSelect: function (name, ngModel, configuration) {

            var element = getFormElement(name, ngModel, configuration);

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
                    if ((undefined !== typeof config.layout) && ('inline' == config.layout)) {
                        typeClass += '-inline';
                    }
                    break;
                }
                case 'radio': {

                    typeClass = 'radio';
                    if ((undefined !== typeof config.layout) && ('inline' == config.layout)) {
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
