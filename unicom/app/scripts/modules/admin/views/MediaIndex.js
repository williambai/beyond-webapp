var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    mediaTpl = require('../templates/_entityMedia.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');
var ListView = require('./__ListView');
var SearchView = require('./__SearchView');

Backbone.$ = $;

//** 模型
var Media = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/protect/medias',	
	defaults: {
		goods: {}
	}
});
//** 集合
var MediaCollection = Backbone.Collection.extend({
	url: config.api.host + '/protect/medias',
	model: Media,
});

//** list子视图
var MediaListView = ListView.extend({
	el: '#list',

	initialize: function(options){
		var page = $(mediaTpl);
		var itemTemplate = $('#itemTemplate', page).html();
		this.template = _.template(_.unescape(itemTemplate || ''));
		this.collection = new MediaCollection();
		ListView.prototype.initialize.apply(this,options);
	},
	getNewItemView: function(model){
		var item = this.template({model: model.toJSON()});
		var $item = $(item);
		$item.find('img').attr('src', model.get('url'));
		return $item.html();
	},
});
//** search 子视图
var MediaSearchView = SearchView.extend({
	el: '#search',

	initialize: function(options){
		var page = $(mediaTpl);
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
		var page = $(mediaTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .add': 'addMedia',
		'click .edit': 'editMedia',
		'click .delete': 'removeMedia',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();

		this.searchView = new MediaSearchView({
			el: '#search',
		});
		this.listView = new MediaListView({
			el: '#list',
		});
		this.searchView.done = function(query){
			that.listView.trigger('refresh', query);
		};
		this.searchView.trigger('load');
		this.listView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
		return false;
	},
	
	addMedia: function(){
		this.router.navigate('media/add',{trigger: true});
		return false;
	},

	editMedia: function(evt){
		var id = this.$(evt.currentTarget).parent().attr('id');
		this.router.navigate('media/edit/'+ id,{trigger: true});
		return false;
	},

	removeMedia: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).parent().attr('id');
			var model = new Media({_id: id});
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