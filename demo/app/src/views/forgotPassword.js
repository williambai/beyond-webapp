var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    ForgotPasswordFormView = require('./_FormForgotPassword'),
	forgotPasswordTemplate = require('../templates/forgotPassword.tpl'),
    forgotPasswordSuccessTemplate = require('../templates/forgotPasswordSuccess.tpl');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	initialize: function(options){
		this.on('load', this.load, this);
	},

	load: function(){
		var that = this;
		var forgotPasswordFormView = new ForgotPasswordFormView();
		forgotPasswordFormView.done = function(){
			that.$el.html(forgotPasswordSuccessTemplate());
		}
		forgotPasswordFormView.trigger('load');
	},

	render: function(){
		this.$el.html(forgotPasswordTemplate());
		return this;
	},

});