var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    preLoginSuccessTemplate = require('../../assets/templates/loginNeedSuccess.tpl');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	render: function(){
		this.$el.html(preLoginSuccessTemplate());
		return this;
	}
});