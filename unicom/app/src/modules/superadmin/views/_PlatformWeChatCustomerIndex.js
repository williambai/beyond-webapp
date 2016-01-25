var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    customerTpl = require('../templates/_entityPlatformWeChatCustomer.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

var WeChatCustomer = require('../models/PlatformWeChatCustomer');
var ListView = require('./_PlatformWeChatCustomerList');

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(customerTpl);
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
		this.listView = new ListView({
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