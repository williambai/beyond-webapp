var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    Register = require('../models/Register');

exports = module.exports = FormView.extend({

	el: '#registerForm',

	initialize: function(options){
		this.model = new Register();
		FormView.prototype.initialize.apply(this,options);
	},

	events: {
		'submit form': 'register',
		'swipeleft': 'swipeToLoginForm',
	},

	register: function(){
		var that = this;
		this.model.set('username', $('input[name=username]').val());
		this.model.set('email', $('input[name=email').val());
		this.model.set('password', $('input[name=password').val());
		this.model.set('cpassword', $('input[name=cpassword').val());
		
		var xhr = this.model.save();
		if(xhr){
			xhr
				.success(function(data){
					if(!!data.code){
						that.$('#error').html('<div class="alert alert-dander">' + data.message + '</div>');
						that.$('#error').slideDown();
						return;
					}
					window.location.hash = 'login';
				})
				.error(function(err){
					console.log(err);
					that.$('#error').html('<div class="alert alert-danger">unknown error</div>');
					that.$('#error').slideDown();
				});
		}

		return false;
	},

	swipeToLoginForm: function(){
		window.location.hash = 'login';
		return false;
	},

});
