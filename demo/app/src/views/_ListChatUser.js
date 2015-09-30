var _ = require('underscore');
var ChatUserView = require('./_ItemChatUser'),
    ChatView = require('./Chat'),
    ListView = require('./__ListView'),
    FriendCollection = require('../models/FriendCollection'),
    ChatCollection = require('../models/ChatCollection');

exports = module.exports = ListView.extend({

	el: '#chat',

	initialize: function(options){
		this.socketEvents = options.socketEvents;
		this.collection = new FriendCollection();
		this.collection.url = options.url || '/accounts/me?type=friend';

		this.currentChatView = options.currentChatView;
		this.chats = options.chats;
		ListView.prototype.initialize.apply(this,options);
	},

	getNewItemView: function(model){
		var chatUserItemView = new ChatUserView({socketEvents: this.socketEvents,model: model});
		chatUserItemView.bind('chat:start', this.startChat, this);
		return chatUserItemView;
	},

	// load: function(){
	// 	this.loaded = true;
	// 	this.collection.fetch({reset:true});
	// },
	// onFriendAdded: function(friend){
	// 	var chatUserView = new ChatUserView({
	// 		model: friend,
	// 		socketEvents: this.socketEvents
	// 	});
	// 	chatUserView.bind('chat:start', this.startChat, this);
	// 	var chatUserHtml = chatUserView.render().el;
	// 	this.$el.append(chatUserHtml);
	// },

	// onCollectionReset: function(collection){
	// 	var that = this;
	// 	that.$el.empty();
	// 	collection.each(function(friend){
	// 		that.onFriendAdded(friend);
	// 	});
	// },
	// render: function(){
	// 	return this;
	// },
	// currentChatView: null,
	// chats: {},
	startChat: function(model){
		if(null != this.currentChatView){
			this.currentChatView.undelegateEvents();
		}
		
		var roomId = model.get('accountId');
		if(!this.chats[roomId]){
			var chatCollection = new ChatCollection();
			var chatView = new ChatView({
					room: model,
					collection: chatCollection,
					socketEvents: this.socketEvents
				});
			chatView.render();
			chatCollection.url = '/chats/' + roomId;
			chatCollection.fetch({reset:true});
			this.chats[roomId] = chatView;
		}else{
			var view = this.chats[roomId];
			view.delegateEvents();
			view.render();
			var collection = view.collection;
			collection.trigger('reset',collection);
		}

		this.currentChatView = this.chats[roomId];
	}
});