var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    indexTemplate = require('../../assets/templates/index.tpl');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',


	render: function(){
		this.$el.html(indexTemplate());
		return this;
	},

});