var Backbone = require('backbone');
var _ = require('underscore');
Backbone.$ = $;

//** 主视图
exports = module.exports = Backbone.View.extend({

	el: '#content',
	template: _.template($('#tpl-not-found').html()),

	initialize: function(options) {
		this.router = options.router;
		this.on('load', this.load, this);
	},

	render: function() {
		this.$el.html(this.template());
		return this;
	},
});