var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    statsTpl = require('../templates/_entityStats.tpl');
var config = require('../conf');
Backbone.$ = $;

//** 模型
var Stats = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/protect/stats/cities?action=account',
});

var city;
var district;

//** 集合
var Statses = Backbone.Collection.extend({
	url: config.api.host + '/protect/stats/cities?action=account',
	model: Stats,
	parse: function(response){
		city = response.city;
		district = response.district;
		return response.docs;
	},
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
		'click a': 'detail',
	},

	load: function(){
		this.collection.fetch({
			xhrFields: {
				withCredentials: true
			},
		});
	},

	renderModel: function(model){
		var html = '';
		if(model.get('userCount')){
			html += '<tr>';
			if(city && district){
				html += '<td>' + model.get('_id') + '-' + district + '-' +city + '</td>';
				html += '<td>' + model.get('userCount') + '</td>';
				html += '<td></td>';
			}else if(city){
				html += '<td>' + model.get('_id') + '-' + city + '</td>';
				html += '<td>' + model.get('userCount') + '</td>';
				html += '<td><a href="#" city="'+ city +'"district="' + model.get('_id') + '">' + '详情' + '</a></td>';
			}else{
				html += '<td>' + model.get('_id') + '</td>';
				html += '<td>' + model.get('userCount') + '</td>';
				html += '<td><a href="#" city=' + model.get('_id') + '>' + '详情' + '</a></td>';
			}
			html += '</tr>';
		}
		this.$('#list').append(html);
		return false;
	},

	cancel: function(){
		this.router.navigate('stats/index',{trigger: true, replace: true});
		return false;
	},

	detail: function(evt){
		var city = this.$(evt.currentTarget).attr('city') || '';
		var district = this.$(evt.currentTarget).attr('district') || '';
		this.collection.reset();
		this.collection.url = config.api.host + '/protect/stats/cities?action=account&city=' + city + '&district=' + district,
		this.render();
		this.load();
		return false;
	},

	render: function(){
		this.$el.html(this.template());
		return this;
	},
});