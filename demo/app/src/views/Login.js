var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    LoginFormView = require('./_FormLogin'),
	loginTemplate = require('../../assets/templates/login.tpl');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	initialize: function(options){
		this.appEvents = options.appEvents;
		this.socketEvents = options.socketEvents;
		this.on('load', this.load, this);
	},

	load: function(){
		var loginForm = new LoginFormView({
			appEvents: this.appEvents,
			socketEvents: this.socketEvents,
		});
		loginForm.trigger('load');
	},

	render: function(){
		this.$el.html(loginTemplate());
		return this;
	},

});