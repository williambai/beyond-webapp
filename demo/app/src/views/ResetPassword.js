var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    ResetPasswordFormView = require('./_FormResetPassword'),
	resetPasswordTemplate = require('../templates/resetPassword.tpl'),
    resetPasswordSuccessTemplate = require('../templates/resetPasswordSuccess.tpl');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	initialize: function(options){
		this.token = options.token;
		this.on('load', this.load, this);
	},

	load: function(){
		var that = this;
		var resetPasswordFormView = new ResetPasswordFormView({token: this.token});
		resetPasswordFormView.done = function(){
			that.$el.html(resetPasswordSuccessTemplate());
		}
		resetPasswordFormView.trigger('load');
	},

	render: function(){
		this.$el.html(resetPasswordTemplate());
		return this;
	},

});