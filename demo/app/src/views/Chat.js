var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    modalTemplate = require('../templates/_modal.tpl'),
    chatSessionTemplate = require('../templates/chat.tpl'),
    ChatFormView = require('./_FormChat'),
    ChatListView = require('./_ListChat');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports =  Backbone.View.extend({

	el: '#content',

	events: {
		'scroll': 'scrollUp',
	},

	initialize: function(options){
		this.id = options.id;
		this.account = options.account;
		this.socketEvents = options.socketEvents;
		this.on('load', this.load, this);
	},

	load: function(){
		this.loaded = true;
		var that = this;
		this.render();
		var url = config.api.host + '/account/chats?fid=' + that.id;
		that.chatListView = new ChatListView({url: url,account: that.account, socketEvents: that.socketEvents});
		that.chatListView.isScrollUp = true;
		that.chatListView.trigger('load');
	},

	scroll: function(){
		if(this.chatListView){
			this.chatListView.trigger('scroll:up');
		}
		return false;
	},

	render: function(){
		var that = this;
		//增加 bottom Bar
		if($('.navbar-absolute-bottom').length == 0){
			var chatFromView = new ChatFormView({
					id: this.id,
					account: this.account,
					socketEvents: this.socketEvents,
					parentView: this,
				});
			chatFromView.done = function(chat){
				that.chatListView.trigger('append', chat);
			};
			this.chatFromView = chatFromView;
			$(chatFromView.render().el).prependTo('.app');
			if(!$('body').hasClass('has-navbar-bottom')){
				$('body').addClass('has-navbar-bottom');
			}
		}
		this.$el.html(chatSessionTemplate());
		return this;
	}
});