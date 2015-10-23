var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	loginTemplate = require('../../assets/templates/login_wechat.tpl');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	events: {
		'submit form': 'login'
	},
	initialize: function(options) {
		this.appEvents = options.appEvents;
	},
	login: function() {
		var that = this;
		$.ajax({
			url: config.api.host + '/login',
			xhrFields: {
				withCredentials: true
			},
			data: {
				email: $('input[name=email]').val(),
				password: $('input[name=password]').val()
			}
		}).done(function(data) {
			that.appEvents.trigger('logined', data);
			window.location.hash = 'index';
		}).fail(function() {
			$('#error').text('登录失败');
			$('#error').slideDown();
		});
		return false;
	},
	render: function() {
		this.$el.html(loginTemplate());
		return this;
	},

});