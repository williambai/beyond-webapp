var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    statsTpl = require('../templates/_entityStats.tpl');
var config = require('../conf');
Backbone.$ = $;

//** 模型
var Stats = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/protect/stats/cities',
});

//** 集合
var Statses = Backbone.Collection.extend({
	url: config.api.host + '/protect/stats/cities',
	model: Stats,
});

exports = module.exports = Backbone.View.extend({

	el: '#content',

	initialize: function(options) {
		this.router = options.router;
		this.collection = new Statses();
		this.collection.on('add', this.renderModel,this);
		var page = $(statsTpl);
		var viewTemplate = $('#accountStatsTemplate', page).html();
		this.template = _.template(_.unescape(viewTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'click .back': 'cancel',
	},

	load: function(){
		this.collection.fetch({
			xhrFields: {
				withCredentials: true
			},
		});
	},

	renderModel: function(model){
		var listView = this.$('#list');
		if(model.get('userCount')){
			listView.append('<tr>');
			listView.append('<td>' + model.get('year') + '/' + model.get('month') + '</td>');
			listView.append('<td>' + model.get('city') + '</td>');
			listView.append('<td>' + model.get('userCount') + '</td>');
			listView.append('</tr>');
		}
		return false;
	},

	cancel: function(){
		this.router.navigate('stats/index',{trigger: true, replace: true});
		return false;
	},

	render: function(){
		this.$el.html(this.template());
		return this;
	},
});