var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	loadingTemplate = require('../templates/loading.tpl'),
	indexTemplate = require('../templates/index.tpl');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	initialize: function(options) {
		this.on('load', this.load, this);
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();
	},

	render: function() {
		if (!this.loaded) {
			this.$el.html(loadingTemplate());
		} else {
			this.$el.html(indexTemplate());
		}
		return this;
	},
});