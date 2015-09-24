var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    Login = require('../models/Login'),
    loginTemplate = require('../../assets/templates/login.tpl');

exports = module.exports = FormView.extend({

	el: '#content',

	events: {
		'submit form': 'login',
		'swiperight': 'toRegisterForm',
	},

	initialize: function(options){
		this.appEvents = options.appEvents;
		this.socketEvents = options.socketEvents;
		this.model = new Login();
		FormView.prototype.initialize.apply(this,options);
	},

	login: function(){
		var that = this;
		this.model.set('email',$('input[name=email]').val());
		this.model.set('password',$('input[name=password]').val());
		var xhr = this.model.save();
		if(xhr){
			xhr
				.success(function(data){
					if(!!data.code){
						that.$('#error').html('<div class="alert alert-danger">' + data.message + '</div>');
						that.$('#error').slideDown();
						return;
					}
					that.appEvents.trigger('logined',data);
					that.socketEvents.trigger('app:logined',{accountId: data.id});
					window.location.hash = 'index';
				})
				.error(function(err){
					console.log(err);
					that.$('#error').html('<div class="alert alert-danger">unknown error</div>');
					that.$('#error').slideDown();
				});
		}
		return false;
	},

	toRegisterForm: function(){
		window.location.hash = 'register';
		return false;
	},

	render: function(){
		this.$el.html(loginTemplate());
		return this;
	},

});