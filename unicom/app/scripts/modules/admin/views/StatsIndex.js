var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    statsTpl = require('../templates/_entityStats.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');
var Utils = require('./__Util');

Backbone.$ = $;

//** 主视图
exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(statsTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'click .viewAccount': 'viewAccount',
		'click .viewOrder': 'viewOrder',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();
	},

	viewAccount: function(evt){
		this.router.navigate('stats/account',{trigger: true});
		return false;
	},

	viewOrder: function(evt){
		this.router.navigate('stats/order',{trigger: true});
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