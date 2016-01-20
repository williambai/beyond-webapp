var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    wechatTpl = require('../templates/_entityWeChat.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

var WeChat = require('../models/WeChat');
var ListView = require('./_WeChatList');

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
		'click .add': 'addWeChat',
		'click .edit': 'editWeChat',
		'click .delete': 'removeWeChat',
		'click .menu': 'wechatMenu',
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

	addWeChat: function(evt){
		this.router.navigate('wechat/add',{trigger: true});
		return false;
	},

	editWeChat: function(evt){
		var $item = this.$(evt.currentTarget).parent().parent();
		var id = $item.attr('id');
		this.router.navigate('wechat/edit/'+ id,{trigger: true});
		return false;
	},

	removeWeChat: function(evt){
		var $item = this.$(evt.currentTarget).parent().parent();
		var id = $item.attr('id');
		if(window.confirm('您确信要删除吗？')){
			var model = new WeChat({_id: id});
			model.destroy({wait: true});
			this.listView.trigger('refresh');
		}
		return false;
	},

	wechatMenu: function(evt){
		var $item = this.$(evt.currentTarget).parent().parent();
		var id = $item.attr('id');
		this.router.navigate('wechat/' + id + '/menu/index',{trigger: true});
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