var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone');
    RegisterFormView = require('./_FormRegister'),
    registerTemplate = require('../../assets/templates/register.tpl');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	initialize: function(options){
		this.on('load', this.load, this);
	},

	load: function(){
		var registerFormView = new RegisterFormView();
		registerFormView.done = function(){
			window.location.hash = 'login';
		};
		registerFormView.trigger('load');
	},

	render: function(){
		this.$el.html(registerTemplate());
		return this;
	},
});
