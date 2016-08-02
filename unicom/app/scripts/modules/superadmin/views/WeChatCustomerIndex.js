var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    wechatTpl = require('../templates/_entityPlatformWeChatCustomer.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');
var ListView = require('./__ListView');

Backbone.$ = $;

//** 模型
var WeChatCustomer = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/protect/wechat/customers',	

	defaults: {
		creator: {}
	},
});

//** 集合
var WeChatCustomerCollection = Backbone.Collection.extend({
	url: config.api.host + '/protect/wechat/customers',
	model: WeChatCustomer,
});

//** list子视图
var WeChatCustomerListView = ListView.extend({
	el: '#list',

	initialize: function(options){
		var page = $(wechatTpl);
		var itemTemplate = $('#itemTemplate', page).html();
		this.template = _.template(_.unescape(itemTemplate || ''));
		this.collection = new WeChatCustomerCollection();
		ListView.prototype.initialize.apply(this,options);
	},
	getNewItemView: function(model){
		return this.template({model: model.toJSON()});
	},
});

//** 主视图
exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(wechatTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .add': 'addWeChatCustomer',
		'click .edit': 'editWeChatCustomer',
		'click .delete': 'removeWeChatCustomer',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();
		this.listView = new WeChatCustomerListView({
			el: '#list',
		});
		this.listView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
		return false;
	},

	addWeChatCustomer: function(evt){
		this.router.navigate('wechat/customer/add',{trigger: true});
		return false;
	},

	editWeChatCustomer: function(evt){
		var $item = this.$(evt.currentTarget).parent().parent();
		var id = $item.attr('id');
		this.router.navigate('wechat/customer/edit/'+ id,{trigger: true});
		return false;
	},

	removeWeChatCustomer: function(evt){
		var $item = this.$(evt.currentTarget).parent().parent();
		var id = $item.attr('id');
		if(window.confirm('您确信要删除吗？')){
			var model = new WeChatCustomer({_id: id});
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