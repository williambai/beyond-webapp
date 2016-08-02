var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    menuTpl = require('../templates/_entityWeChatMenu.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

//** 模型
var Menu = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: function(){
		return config.api.host + '/protect/wechat/'+ this.get('wid') + '/menus';
	},
});

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.wid = options.wid;
		this.router = options.router;
		var page = $(menuTpl);
		var indexTemplate = $('#exportTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'submit form': 'submit',
		'click .back': 'cancel',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();
	},

	cancel: function(){
		this.router.navigate('wechat/'+ this.wid + '/menu/index',{trigger: true, replace: true});
		return false;
	},

	submit: function(evt){
		var that = this;
		$.ajax({
			url: config.api.host + '/protect/wechat/'+ that.wid + '/menus',
			type: 'POST',
			data: {
				action: 'export'
			},
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
		});
		this.router.navigate('wechat/'+ this.wid +'/menu/index',{trigger: true});
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