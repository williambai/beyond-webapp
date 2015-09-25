var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    projectChatTemplate = require('../../assets/templates/projectChat.tpl'),
    ChatFormView = require('./_FormProjectChat'),
    ChatListView = require('./_ListProjectChat'),
    Project = require('../models/Project');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	events: {
		'scroll': 'scroll',
	},

	initialize: function(options){
		this.pid = options.id;
		this.account = options.account;
		this.socketEvents = options.socketEvents;
		this.model = new Project();
		this.model.url = '/projects/' + options.id;
		this.model.on('change', this.render,this);
		this.on('load', this.load, this);
	},

	load: function(){
		this.loaded = true;
		var that = this;
		this.model.fetch({
			success: function(model){
				if(that.account.id == model.get('accountId')){
					model.set('isOwner', true);
				}
				var url = '/statuses/project/' + that.pid;
				that.chatListView = new ChatListView({url: url,account: that.account, socketEvents: that.socketEvents});
				that.chatListView.isScrollUp = true;
				that.chatListView.trigger('load');
			}
		});
	},

	scroll: function(){
		if(this.chatListView){
			this.chatListView.trigger('scroll:up');
		}
		return false;
	},

	render: function(){
		//增加 bottom Bar
		if(this.model.get('_id') && $('.navbar-absolute-bottom').length == 0){
			var chatFormView = new ChatFormView({
					id: this.id,
					project: this.model,
					account: this.account,
					socketEvents: this.socketEvents,
					parentView: this,
				});
			$(chatFormView.render().el).prependTo('.app');
			if(!$('body').hasClass('has-navbar-bottom')){
				$('body').addClass('has-navbar-bottom');
			}
		}
		this.$el.html(projectChatTemplate({project: this.model.toJSON()}));
		return this;
	}

});