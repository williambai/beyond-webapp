var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	forgotPasswordTemplate = require('../../assets/templates/forgotPassword.tpl');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	events: {
		'submit form': 'forgotPassword'
	},
	forgotPassword: function() {
		$.ajax({
			url: config.api.host + '/forgotPassword',
			type: 'POST',
			xhrFields: {
				withCredentials: true
			},
			data: {
				email: $('input[name=email]').val()
			}
		}).done(function(data) {
			window.location.hash = 'forgotpassword/success';
		}).fail(function() {

		});
		return false;
	},
	render: function() {
		this.$el.html(forgotPasswordTemplate());
		return this;
	}
});