var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone');
    RegisterFormView = require('./_FormRegister'),
    preLoginTemplate = require('../../assets/templates/loginNeed.tpl');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	initialize: function(options){
		this.on('load', this.load, this);
	},

	load: function(){
		var registerFormView = new RegisterFormView();
		registerFormView.success = function(){
			window.location.hash = 'login';
		};
		registerFormView.trigger('load');
	},

	render: function(){
		this.$el.html(preLoginTemplate());
		return this;
	},
});
