var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    sessionTpl = require('../templates/_entityPlatformSession.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');
var ListView = require('./__ListView');
var SearchView = require('./__SearchView');

Backbone.$ = $;

//** 模型
var Session = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/protect/sessions',
	validation: {
	},
});
//** 集合
var SessionCollection = Backbone.Collection.extend({
	url: config.api.host + '/protect/sessions',
	model: Session,
});

//** list子视图
var SessionListView = ListView.extend({
	el: '#list',

	initialize: function(options){
		var page = $(sessionTpl);
		var itemTemplate = $('#itemTemplate', page).html();
		this.template = _.template(_.unescape(itemTemplate || ''));
		this.collection = new SessionCollection();
		ListView.prototype.initialize.apply(this,options);
	},
	getNewItemView: function(model){
		var session = model.get('session');
		try{
			session = JSON.parse(session);
			model.set('email',session.email);
			model.set('username',session.username);
			model.set('apps',session.apps);
			model.set('grants', _.keys(session.grant).join('; ').slice(0,40) + '...');
		}catch(err){
			model.set('email',session);
		}
		return this.template({model: model.toJSON()});
	},
});

//** search子视图
var SessionSearchView = SearchView.extend({
	el: '#search',

	initialize: function(options){
		var page = $(sessionTpl);
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
		var page = $(sessionTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .add': 'addSession',
		'click .edit': 'editSession',
		'click .delete': 'removeSession',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();

		this.listView = new SessionListView({
			el: '#list',
		});
		this.searchView = new SessionSearchView({
			el: '#search',
		});
		this.searchView.done = function(query){
			that.listView.trigger('refresh', query);
		};
		this.listView.trigger('load');
		this.searchView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
		return false;
	},
	
	addSession: function(){
		this.router.navigate('session/add',{trigger: true});
		return false;
	},

	editSession: function(evt){
		var id = this.$(evt.currentTarget).parent().attr('id');
		this.router.navigate('session/edit/'+ id,{trigger: true});
		return false;
	},

	removeSession: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).parent().attr('id');
			var model = new Session({_id: id});
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