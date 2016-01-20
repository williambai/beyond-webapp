var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    menuTpl = require('../templates/_entityWeChatMenu.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

var Menu = require('../models/WeChatMenu');
var ListView = require('./_WeChatMenuList');

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.wid = options.wid;
		this.router = options.router;
		var page = $(menuTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .add': 'addMenu',
		'click .edit': 'editMenu',
		'click .delete': 'removeMenu',
		'click .export': 'exportMenu',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();
		this.listView = new ListView({
			el: '#list',
			wid: this.wid,
		});
		this.listView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
		return false;
	},

	addMenu: function(evt){
		this.router.navigate('wechat/'+ this.wid +'/menu/add',{trigger: true});
		return false;
	},

	editMenu: function(evt){
		var $item = this.$(evt.currentTarget).parent().parent();
		var id = $item.attr('id');
		this.router.navigate('wechat/'+ this.wid +'/menu/edit/'+ id,{trigger: true});
		return false;
	},

	removeMenu: function(evt){
		var $item = this.$(evt.currentTarget).parent().parent();
		var id = $item.attr('id');
		if(window.confirm('您确信要删除吗？')){
			var model = new Menu({_id: id,wid: this.wid});
			model.destroy({wait: true});
			this.listView.trigger('refresh');
		}
		return false;
	},

	exportMenu: function(evt){
		this.router.navigate('wechat/'+ this.wid +'/menu/export',{trigger: true});
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