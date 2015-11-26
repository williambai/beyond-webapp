var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    LoginFormView = require('./_FormLogin'),
	loginTemplate = _.template(require('../templates/login.tpl'));

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	initialize: function(options){
		this.appEvents = options.appEvents;
		this.on('load', this.load, this);
	},

	load: function(){
		var loginFormView = new LoginFormView({
			appEvents: this.appEvents,
		});
		loginFormView.done = function(){
			window.location.hash = 'index';
		}
		loginFormView.trigger('load');
	},

	render: function(){
		this.$el.html(loginTemplate());
		return this;
	},

});