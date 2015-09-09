var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    projectItemTemplate = require('../../assets/templates/_itemProject_wechat.tpl');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	tagName: 'div',

	events: {
	},

	initialize: function(options){
	},


	render: function(){
		this.$el.html(projectItemTemplate(this.model.toJSON()));
		return this;
	}
});