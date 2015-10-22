var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    forgotPasswordTemplate = require('../../assets/templates/forgotPassword.tpl');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	events: {
		'submit form': 'forgotPassword'
	},
	forgotPassword: function(){
		$.post(config.api.host + '/forgotPassword',{
			email: $('input[name=email]').val()
		},function(data){
			window.location.hash = 'forgotpassword/success';
		});
		return false;
	},
	render: function(){
		this.$el.html(forgotPasswordTemplate());
		return this;
	}
});