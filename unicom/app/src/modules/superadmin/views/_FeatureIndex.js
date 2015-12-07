var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    featureTpl = require('../templates/_entityFeature.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

var ListView = require('./_FeatureList');
var AddView = require('./_FeatureAdd');
var EditView = require('./_FeatureEdit');

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		var page = $(featureTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));

		this.addView = new AddView({
			el: '#content',
		});
		this.editView = new EditView({
			el: '#content',
		});
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .add': 'addFeature',
		'click .edit': 'editFeature',
		'click .delete': 'removeFeature',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();

		this.listView = new ListView({
			el: '#list',
		});

		this.listView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
		return false;
	},
	
	addFeature: function(){
		this.addView.trigger('load');
	},

	editFeature: function(){
		this.editView.id = 'id';
		this.editView.trigger('load');
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