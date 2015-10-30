var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    forgotPasswordSuccessTemplate = require('../templates/forgotPasswordSuccess.tpl');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	render: function(){
		this.$el.html(forgotPasswordSuccessTemplate());
		return this;
	}
});