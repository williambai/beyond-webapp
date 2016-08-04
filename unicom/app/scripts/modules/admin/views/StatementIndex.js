var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    statementTpl = require('../templates/_entityStatement.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');
var ListView = require('./__ListView');
var SearchView = require('./__SearchView');
Backbone.$ = $;

//** Bonus模型
var Bonus = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/protect/finance/statements',	
	defaults: {
	},
});
//** Bonus集合
var BonusCollection = Backbone.Collection.extend({
	model: Bonus,
	url: config.api.host + '/protect/finance/statements',
});

//** List子视图
var BonusListView = ListView.extend({
	el: '#list',

	initialize: function(options){
		var page = $(statementTpl);
		var itemTemplate = $('#itemTemplate', page).html();
		this.template = _.template(_.unescape(itemTemplate || ''));
		this.collection = new BonusCollection();
		ListView.prototype.initialize.apply(this,options);
	},
	getNewItemView: function(model){
		return this.template({model: model.toJSON()});
	},
});

//** Search子视图
var BonusSearchView = SearchView.extend({
	el: '#search',

	initialize: function(options){
		var page = $(statementTpl);
		var searchTemplate = $('#searchTemplate', page).html();
		this.template = _.template(_.unescape(searchTemplate || ''));
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
		var query = this.$('form').serialize();
		this.done(query);
		return false;
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
	},
});

//** 主视图
exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(statementTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .import': 'importStatement', //** 1
		'click .export': 'exportStatement', //** 2
		// 'click .add': 'addView',
		'click .edit': 'editView',
		'click .delete': 'remove',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();
		this.listView = new BonusListView({
			el: '#list',
		});
		this.listView.trigger('load');
		this.searchView = new BonusSearchView({
			el: '#search',
		});
		this.searchView.done = function(query){
			that.listView.trigger('refresh', query);
		};
		this.searchView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
		return false;
	},

	addView: function(evt){
		this.router.navigate('statement/add',{trigger: true});
		return false;
	},

	editView: function(evt){
		var id = this.$(evt.currentTarget).closest('.item').attr('id');
		this.router.navigate('statement/edit/'+ id,{trigger: true});
		return false;
	},

	remove: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).closest('.item').attr('id');
			var model = new Bonus({_id: id});
			model.destroy({wait: true});
			this.listView.trigger('refresh');
		}
		return false;
	},

	importStatement: function(){
		this.router.navigate('statement/import',{trigger: true});
		return false;
	},

	exportStatement: function(){
		this.router.navigate('statement/export',{trigger: true});
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