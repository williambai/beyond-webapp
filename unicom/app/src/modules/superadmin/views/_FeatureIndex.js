var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    featureTpl = require('../templates/_entityFeature.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

var Feature = require('../models/Feature');

Backbone.$ = $;

var ListView = require('./_FeatureList');

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(featureTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
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
		this.router.navigate('feature/add',{trigger: true});
		return false;
	},

	editFeature: function(evt){
		var id = this.$(evt.currentTarget).parent().attr('id');
		this.router.navigate('feature/edit/'+ id,{trigger: true});
		return false;
	},

	removeFeature: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).parent().attr('id');
			var model = new Feature({_id: id});
			model.destroy({wait: true});
			this.listView.trigger('refresh',model.urlRoot);
		}
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