var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    statsTpl = require('../templates/_entityStats.tpl');
var config = require('../conf');
var Utils = require('./__Util');
var ListView = require('./__ListView');
var SearchView = require('./__SearchView');
Backbone.$ = $;

//** 模型
var Stats = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/protect/stats/cities',
});

var city;
var district;

//** 集合
var Statses = Backbone.Collection.extend({
	url: config.api.host + '/protect/stats/cities',
	model: Stats,
	parse: function(response){
		city = response.city;
		district = response.district;
		return response.docs;
	}
});

//** List子视图
var OrderListView  = ListView.extend({
	el: '#list',

	initialize: function(options){
		this.collection = new Statses();
		ListView.prototype.initialize.apply(this,options);
	},

	getNewItemView: function(model){
		var html = '';
		if(model.get('_id')){
			html += '<tr>';
			if(city && district){
				html += '<td>' + model.get('_id') + '-' + district + '-' +city + '</td>';
				html += '<td>' + model.get('quantity') + '</td>';
				html +='<td>' + model.get('total') + '</td>';
				html += '<td></td>';
			}else if(city){
				html += '<td>' + model.get('_id') + '-' + city + '</td>';
				html += '<td>' + model.get('quantity') + '</td>';
				html +='<td>' + model.get('total') + '</td>';
				html += '<td><a href="#" city="'+ city +'"district="' + model.get('_id') + '">' + '详情' + '</a></td>';
			}else{
				html += '<td>' + model.get('_id') + '</td>';
				html += '<td>' + model.get('quantity') + '</td>';
				html +='<td>' + model.get('total') + '</td>';
				html += '<td><a href="#" city=' + model.get('_id') + '>' + '详情' + '</a></td>';
			}
			html += '</tr>';
		}
		return html;
	},
});
//** Search子视图
var OrderSearchView = SearchView.extend({
	el: '#search',

	initialize: function(options){
		this.model = new (Backbone.Model.extend({}));
		this.on('load', this.load,this);
	},

	events: {
		'submit form': 'search'
	},

	load: function(){
		this.render();
	},

	search: function(){
		var that = this;
		var query = this.$('form').serialize();
		this.done(query);
		return false;
	},

	render: function(){
		// this.$el.html(this.template({model: this.model.toJSON()}));
		var now = new Date();
		now.setDate(1);
		this.$('input[name=from]').val(Utils.dateFormat(now,'yyyy-MM-dd'));
		return this;
	},
});

exports = module.exports = Backbone.View.extend({

	el: '#content',

	initialize: function(options) {
		this.router = options.router;
		var page = $(statsTpl);
		var viewTemplate = $('#orderStatsTemplate', page).html();
		this.template = _.template(_.unescape(viewTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'click .back': 'cancel',
		'click a': 'detail',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();

		this.searchView = new OrderSearchView({
			el: '#search',
		});
		this.searchView.done = function(query){
			that.listView.trigger('refresh', query);
		};
		this.listView = new OrderListView({
			el: '#list',
		});
		this.searchView.trigger('load');
		this.listView.trigger('load');
		this.listView.trigger('refresh','action=order');
	},

	scroll: function() {
		// this.listView.scroll();
		return false;
	},

	detail: function(evt){
		var city = this.$(evt.currentTarget).attr('city') || '';
		var district = this.$(evt.currentTarget).attr('district') || '';
		var from = this.$('input[name=from]').val() || '';
		var to = this.$('input[name=to]').val() || '';
		this.listView.trigger('refresh','action=order'+ '&from=' +from + '&to='+ to +'&city=' + city + '&district=' + district);
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