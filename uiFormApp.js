angular.module('uiFormApp', ['ui.bootstrap', 'uiFormModule']).controller('UiFormAppController', ['$scope', function ($scope) {

	var _this = this;

	// Should be fetched through service.
	var metadata = {
		name: {
			label: 'First Name',
			placeholder: 'Please enter your name',
			type: 'text',
			isRequired: false,
			minlength: 2,
			maxlength: 5,
			pattern: '/^[a-zA-Z ]*$/'
		},
		last: {
			label: 'Last Name',
			placeholder: 'Please enter your last name',
			type: 'text',
			isRequired: true,
			minlength: 3,
			maxlength: 6,
			pattern: '/^[a-zA-Z ]*$/'
		},
		age: {
			label: 'Age',
			placeholder: 'Please enter your age',
			type: 'number',
			isRequired: true,
			max: 30
		},
		birthDay: {
			label: 'Birth Day',
			placeholder: 'Please enter your birth date',
			type: 'date',
			isRequired: true,
			min: '2013-01-01'
		}
	}

	// Should be fetched/submitted through service.
	var payload = {
		name: 'John',
		last: 'Doe',
		age: 10,
		birthDay: new Date('2000-01-01')
	}

	var payload2 = {
		name: 'Jane',
		last: 'Smith',
		age: 30,
		birthDay: new Date('1998-11-11')
	}

	_this.submitHandler = function () {

		console.log('Submitted');
	}

	_this.getScope = function() {
		return $scope;
	}

	_this.changeLabel = function(){
		_this.model.metadata.name.label = 'New Label';
	}

	// The model should be fetched by a service in real life example.
	_this.model = {
		metadata: metadata,
		payload: payload,
		formMode: true
	};

	_this.editMode = function() {

		_this.toggleFormMode(true);
	}

	_this.viewMode = function() {
		_this.toggleFormMode(false);
	}

	_this.toggleFormMode = function(mode) {

		if (!mode) {
			_this.model.formMode = false;
		} else {
			_this.model.formMode = true;
		}
	}
}]);
