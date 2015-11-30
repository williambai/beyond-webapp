var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone');

var	loadingTpl= require('../templates/__loading.tpl'),
	templateTpl = require('../templates/index.tpl');

var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',
	loaded: false,

	template: _.template(templateTpl),
	loadingTemplate: _.template(loadingTpl),

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
			this.$el.html(this.loadingTemplate());
		} else {
			this.$el.html(this.template());
		}
		return this;
	},
});