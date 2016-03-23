var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    revenueTpl = require('../templates/_entityRevenue.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#statView',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(revenueTpl);
		var statTemplate = $('#statTemplate', page).html();
		this.template = _.template(_.unescape(statTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'click .index': 'revenueIndex',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();
	},

	revenueIndex: function(evt){
		var id = this.$(evt.currentTarget).parent().attr('id');
		this.router.navigate('revenue/index',{trigger: true});
		return false;
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