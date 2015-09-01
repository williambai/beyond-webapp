var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    loginTemplate = require('../../assets/templates/login.tpl');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({
	el: '#content',

	events: {
		'submit form': 'login',
		'swiperight': 'toRegisterForm',
	},
	initialize: function(options){
		this.appEvents = options.appEvents;
	},
	login: function(){
		var that = this;
		$.post(config.api.host + '/login',{
			email: $('input[name=email]').val(),
			password: $('input[name=password]').val()
		},function(account){
			that.appEvents.trigger('logined',account);
			window.location.hash = 'index';
		}).error(function(){
			$('#error').text('登录失败');
			$('#error').slideDown();
		});
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
