var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
	Register = require('../models/Register');

exports = module.exports = FormView.extend({

	el: '#registerForm',

	initialize: function(options) {
		this.model = new Register();
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'submit form': 'register',
		'swipeleft': 'swipeToLoginForm',
	},

	register: function() {
		var that = this;
		//clean errors
		that.$('.form-group').removeClass('has-error');
		that.$('.form-group span.help-block').empty();
		//set model
		this.model.set('username', $('input[name=username]').val());
		this.model.set('email', $('input[name=email').val());
		this.model.set('password', $('input[name=password').val());
		this.model.set('cpassword', $('input[name=cpassword').val());

		if (this.model.isValid()) {
			var xhr = this.model.save(null, {
				xhrFields: {
					withCredentials: true
				},
			});
			if (xhr) {
				xhr
					.success(function(data) {
						if (!!data.code) {
							if (data.code == 11000) {
								that.$('#error').html('<div class="alert alert-danger">' + '该邮箱已注册' + '</div>');
							} else {
								that.$('#error').html('<div class="alert alert-danger">' + data.errmsg + '</div>');
							}
							that.$('#error').slideDown();
							return;
						}
						//update UI
						that.done();
					})
					.error(function(xhr) {
						that.$('#error').html('<div class="alert alert-danger">' + xhr.status + ': ' + xhr.responseText + '</div>');
						that.$('#error').slideDown();
					});
			}
		}
		return false;
	},

	swipeToLoginForm: function() {
		window.location.hash = 'login';
		return false;
	},

});