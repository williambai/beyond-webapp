var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
	Login = require('../models/Login');

exports = module.exports = FormView.extend({

	el: '#loginForm',

	events: {
		'submit form': 'login',
		'swiperight': 'toRegisterForm',
	},

	initialize: function(options) {
		this.appEvents = options.appEvents;
		this.socketEvents = options.socketEvents;
		this.model = new Login();
		FormView.prototype.initialize.apply(this, options);
	},

	login: function() {
		var that = this;
		this.model.set('email', $('input[name=email]').val());
		this.model.set('password', $('input[name=password]').val());

		if(this.model.isValid()){
			var xhr = this.model.save(null, {
				xhrFields: {
					withCredentials: true
				},
			});
			if(xhr){
				xhr
					.success(function(data){
						if(!!data.code){
							that.$('#error').html('<div class="alert alert-danger">' + data.message + '</div>');
							that.$('#error').slideDown();
							return;
						}
						//update UI
						that.done();
						//trigger socket.io
						that.appEvents.trigger('logined',data);
						that.socketEvents.trigger('app:logined',{accountId: data.id});
					})
					.error(function(err){
						console.log(err);
						that.$('#error').html('<div class="alert alert-danger">unknown error</div>');
						that.$('#error').slideDown();
					});
			}			
		}
		return false;
	},

	toRegisterForm: function() {
		window.location.hash = 'register';
		return false;
	},

});