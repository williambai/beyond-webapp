var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    browserTpl = require('../templates/_entityPlatformFile.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');
var ListView = require('./__ListView');
var SearchView = require('./__SearchView');

Backbone.$ = $;

//** 模型
var PlatformFile = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/protect/files',	
});

//** 集合
var PlatformFileCollection = Backbone.Collection.extend({
	url: config.api.host + '/protect/files',
	model: PlatformFile,
});

//** list 子视图
var FileListView = ListView.extend({
	el: '#list',

	initialize: function(options){
		var page = $(browserTpl);
		var itemTemplate = $('#itemTemplate', page).html();
		this.template = _.template(_.unescape(itemTemplate || ''));
		this.collection = new PlatformFileCollection();
		ListView.prototype.initialize.apply(this,options);
	},
	getNewItemView: function(model){
		return this.template({model: model.toJSON()});
	},
});

//** search 子视图
var FileSearchView = SearchView.extend({
	el: '#search',

	initialize: function(options){
		var page = $(browserTpl);
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
		var page = $(browserTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .addFile': 'addPlatformFile',
		'click .view': 'viewPlatformFile',
		'click .folder': 'browseFolder',
		'click .edit': 'editPlatformFile',
		'click .delete': 'removePlatformFile',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();

		this.searchView = new FileSearchView({
			el: '#search',
		});
		this.listView = new FileListView({
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
	
	addPlatformFile: function(evt){
		var id = this.$(evt.currentTarget).closest('.item').attr('id');
		this.router.navigate('file/add/'+ encodeURIComponent(id),{trigger: true});
		return false;
	},

	viewPlatformFile: function(evt){
		var id = this.$(evt.currentTarget).closest('.item').attr('id');
		this.router.navigate('file/view/'+ encodeURIComponent(id),{trigger: true});
		return false;
	},

	browseFolder: function(evt){
		var id = this.$(evt.currentTarget).closest('.item').attr('id');
		this.listView.trigger('refresh', 'root=' + id);
		return false;
	},

	editPlatformFile: function(evt){
		var id = this.$(evt.currentTarget).closest('.item').attr('id');
		this.router.navigate('file/edit/'+ id,{trigger: true});
		return false;
	},

	removePlatformFile: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).closest('.item').attr('id');
			var model = new PlatformFile({_id: id});
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