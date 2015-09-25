var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    modalTemplate = require('../../assets/templates/_modal.tpl'),
    chatSessionTemplate = require('../../assets/templates/chat.tpl'),
    ChatFormView = require('./_FormChat'),
    ChatListView = require('./_ListChat');

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
		var url = '/chats/account/' + that.id;
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
		//增加 bottom Bar
		if($('.navbar-absolute-bottom').length == 0){
			var chatFromView = new ChatFormView({
					id: this.id,
					account: this.account,
					socketEvents: this.socketEvents,
					parentView: this,
				});
			$(chatFromView.render().el).prependTo('.app');
			if(!$('body').hasClass('has-navbar-bottom')){
				$('body').addClass('has-navbar-bottom');
			}
		}
		this.$el.html(chatSessionTemplate());
		return this;
	}
});