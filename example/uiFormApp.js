var uiFormApp = angular.module('uiFormApp', ['ui.bootstrap', 'uiFormModule']).controller('UiFormAppController', ['$scope', function ($scope) {

	var _this = this;

	// Should be fetched through service.
	var metadata = {
		name: {
			label: 'First Name',
			placeholder: 'Please enter your name',
			type: 'text',
			labelGridSize: 'col-sm-4',
			valueGridSize: 'col-sm-8',
			isRequired: false,
			minlength: 2,
			maxlength: 5,
			pattern: '/^[a-zA-Z ]*$/'
		},
		last: {
			label: 'Last Name',
			placeholder: 'Please enter your last name',
			type: 'text',
			labelGridSize: 'col-sm-4',
			valueGridSize: 'col-sm-8',
			isRequired: true,
			minlength: 3,
			maxlength: 6,
			pattern: '/^[a-zA-Z ]*$/'
		},
		age: {
			label: 'Age',
			placeholder: 'Please enter your age',
			type: 'number',
			labelGridSize: 'col-sm-4',
			valueGridSize: 'col-sm-8',
			isRequired: true,
			max: 30
		},
		birthDay: {
			label: 'Birth Day',
			placeholder: 'Please enter your birth date',
			type: 'date',
			labelGridSize: 'col-sm-4',
			valueGridSize: 'col-sm-8',
			isRequired: true,
			min: '2013-01-01'
		},
		hobbies: {
			label: 'Hobbies',
			type: 'checkbox',
			gridSize: 'col-sm-offset-4 col-sm-8',
			layout: 'horizontal',
			isRequired: true
		},
		acceptLicenseAgreement: {
			label: '',
			type: 'checkbox',
			gridSize: 'col-sm-offset-4 col-sm-8',
			isRequired: true
		}

	}

	// Should be fetched/submitted through service.
	var payload = {
		name: 'John',
		last: 'Doe',
		age: 10,
		birthDay: new Date('2000-01-01'),
		hobbies: [
			{
				label: 'Chess',
				value: true
			},
			{
				label: 'GO',
				value: false
			},
			{
				label: 'Basketball',
				value: false
			},
			{
				label: 'Reading',
				value: false
			},
			{
				label: 'Smoking',
				value: true
			}
		],
		acceptLicenseAgreement: {
			label: 'Accept License Agreement',
			value: true
		}
	}

	// The model should be fetched by a service in real life example.
	_this.model = {
		metadata: metadata,
		payload: payload,
		editMode: true
	};

	_this.editMode = function() {

		_this.toggleFormMode(true);
	}

	_this.viewMode = function() {
		_this.toggleFormMode(false);
	}

	_this.toggleFormMode = function(mode) {

		if (!mode) {
			_this.model.editMode = false;
		} else {
			_this.model.editMode = true;
		}
	}
}]);
