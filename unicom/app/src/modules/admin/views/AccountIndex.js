var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    accountTpl = require('../templates/_entityAccount.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');
var SearchView = require('./__SearchView');
var ListView = require('./__ListView');

Backbone.$ = $;

//** 模型
var Account = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/protect/accounts',
	defaults: {
		apps: [],
		roles: [],
		department: {},
	},

	validation: {
		'username': {
			required: true,
			msg: '请输入用户名'
		},
		'email': {
			pattern: /^(1\d{10}|[a-zA-Z0-9_\.]+@[a-zA-Z0-9-]+[\.a-zA-Z]+)$/,
			msg: '请输入有效的手机号码或电子邮件'
		},
	},
	
});
//** 集合
var AccountCollection = Backbone.Collection.extend({
	url: config.api.host + '/protect/accounts',
	model: Account,
});

//** List子视图
var AccountListView = ListView.extend({
	el: '#list',

	initialize: function(options){
		var page = $(accountTpl);
		var itemTemplate = $('#itemTemplate', page).html();
		this.template = _.template(_.unescape(itemTemplate || ''));
		this.collection = new AccountCollection();
		ListView.prototype.initialize.apply(this,options);
	},
	getNewItemView: function(model){
		return this.template({model: model.toJSON()});
	},
});
//** Search子视图
var AccountSearchView = SearchView.extend({
	el: '#search',

	initialize: function(options){
		var page = $(accountTpl);
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
		var page = $(accountTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));

		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .add': 'addAccount',
		'click .edit': 'editAccount',
		'click .delete': 'removeAccount',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();
		this.listView = new AccountListView({
			el: '#list',
		});
		this.listView.trigger('load');
		this.searchView = new AccountSearchView({
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
	
	addAccount: function(){
		this.router.navigate('account/add',{trigger: true});
		return false;
	},

	editAccount: function(evt){
		var id = this.$(evt.currentTarget).parent().attr('id');
		this.router.navigate('account/edit/'+ id,{trigger: true});
		return false;
	},

	removeAccount: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).parent().attr('id');
			var model = new Account({_id: id});
			model.destroy({wait: true});
			this.listView.trigger('refresh');
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