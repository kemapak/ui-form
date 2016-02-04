uiFormModule.directive('uiFormFieldset', [function(){

    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        require: '^uiForm',
        template: '<fieldset data-ng-transclude></fieldset>',

        link: function(scope, element, attrs) {

            if ('undefined' != attrs.legend) {

                var legendElement = document.createElement('legend');
                legendElement.setAttribute('data-ng-bind', attrs.legend);

                element.append(legendElement);
            }
        }
    };

}]);
