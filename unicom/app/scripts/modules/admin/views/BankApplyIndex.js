var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    bankTpl = require('../templates/_entityBankApply.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');
var ListView = require('./__ListView');
var SearchView = require('./__SearchView');
Backbone.$ = $;

//** Bank模型
var Bank = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/protect/finance/bank/applys',	
	defaults: {
	},
});
//** Bank集合
var BankCollection = Backbone.Collection.extend({
	model: Bank,
	url: config.api.host + '/protect/finance/bank/applys',
});

//** List子视图
var BankListView = ListView.extend({
	el: '#list',

	initialize: function(options){
		var page = $(bankTpl);
		var itemTemplate = $('#itemTemplate', page).html();
		this.template = _.template(_.unescape(itemTemplate || ''));
		this.collection = new BankCollection();
		ListView.prototype.initialize.apply(this,options);
	},
	getNewItemView: function(model){
		return this.template({model: model.toJSON()});
	},
});

//** Search子视图
var BankSearchView = SearchView.extend({
	el: '#search',

	initialize: function(options){
		var page = $(bankTpl);
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
		var page = $(bankTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .pass': 'pass',
		'click .fail': 'fail',
		'click .edit': 'editView',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();
		this.listView = new BankListView({
			el: '#list',
		});
		this.listView.trigger('load');
		// this.searchView = new BankSearchView({
		// 	el: '#search',
		// });
		// this.searchView.done = function(query){
		// 	that.listView.trigger('refresh', query);
		// };
		// this.searchView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
		return false;
	},


	pass: function(evt){
		if(window.confirm('您确信要审核通过吗？')){
			var id = this.$(evt.currentTarget).closest('.item').attr('id');
			var model = new Bank({_id: id});
			model.set('status', '通过');
			model.save(null, {
				xhrFields: {
					withCredentials: true
				},
			});
			this.listView.trigger('refresh');
		}
		return false;
	},

	fail: function(evt){
		if(window.confirm('您确信要审核不通过吗？')){
			var id = this.$(evt.currentTarget).closest('.item').attr('id');
			var model = new Bank({_id: id});
			model.set('status', '放弃');
			model.save(null, {
				xhrFields: {
					withCredentials: true
				},
			});
			this.listView.trigger('refresh');
		}
		return false;
	},

	editView: function(evt){
		var id = this.$(evt.currentTarget).closest('.item').attr('id');
		this.router.navigate('bank/apply/edit/'+ id,{trigger: true});
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