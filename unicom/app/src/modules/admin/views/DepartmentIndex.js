var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    departmentTpl = require('../templates/_entityDepartment.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');
var ListView = require('./__ListView');
var SearchView = require('./__SearchView');

Backbone.$ = $;

//** 模型
var Department = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/protect/departments',

	validation: {
		name: {
			required : true,
			msg: '请输入渠道名称'
		},
	},
});
//** 集合
var DepartmentCollection = Backbone.Collection.extend({
	url: config.api.host + '/protect/departments',
	model: Department,
});

//** list子视图
var DepartmentListView = ListView.extend({
	el: '#list',

	initialize: function(options){
		var page = $(departmentTpl);
		var itemTemplate = $('#itemTemplate', page).html();
		this.template = _.template(_.unescape(itemTemplate || ''));
		this.collection = new DepartmentCollection();
		ListView.prototype.initialize.apply(this,options);
	},
	getNewItemView: function(model){
		return this.template({model: model.toJSON()});
	},
});
//** search子视图
var DepartmentSearchView = SearchView.extend({
	el: '#search',

	initialize: function(options){
		var page = $(departmentTpl);
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
		this.$el.html(this.template());
	},
});
//** 主视图
exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(departmentTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .add': 'addDepartment',
		'click .edit': 'editDepartment',
		'click .delete': 'removeDepartment',
		'click .import': 'importDepartment',
		'click .export': 'exportDepartment',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();

		this.searchView = new DepartmentSearchView({
			el: '#search',
		});
		this.searchView.done = function(query){
			that.listView.trigger('refresh', query);
		};
		this.listView = new DepartmentListView({
			el: '#list',
		});
		this.searchView.trigger('load');
		this.listView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
		return false;
	},
	addDepartment: function(){
		this.router.navigate('department/add',{trigger: true});
		return false;
	},

	editDepartment: function(evt){
		var id = this.$(evt.currentTarget).parent().attr('id');
		this.router.navigate('department/edit/'+ id,{trigger: true});
		return false;
	},

	removeDepartment: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).parent().attr('id');
			var model = new Department({_id: id});
			model.destroy({wait: true});
			this.listView.trigger('refresh');
		}
		return false;
	},


	importDepartment: function(){
		this.router.navigate('department/import',{trigger: true});
		return false;
	},

	exportDepartment: function(){
		this.router.navigate('department/export',{trigger: true});
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