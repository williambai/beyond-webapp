var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone');
var RegisterFormView = require('./_FormRegister'),
    registerTemplate = _.template(require('../templates/register.tpl')),
    registerSuccessTemplate = _.template(require('../templates/registerSuccess.tpl'));

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	initialize: function(options){
		this.on('load', this.load, this);
	},

	load: function(){
		var that = this;
		var registerFormView = new RegisterFormView();
		registerFormView.done = function(){
			that.$el.html(registerSuccessTemplate());
		};
		registerFormView.trigger('load');
	},

	render: function(){
		this.$el.html(registerTemplate());
		return this;
	},
});
