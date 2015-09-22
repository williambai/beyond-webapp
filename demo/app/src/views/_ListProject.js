var _ = require('underscore');
var ListView = require('./__ListView'),
    ProjectItemView = require('./_ItemProject'),
    // ChatView = require('./ProjectChat'),
    // ChatCollection = require('../models/ChatCollection'),
    ProjectCollection = require('../models/ProjectCollection');

exports = module.exports = ListView.extend({

	el: '#projectlist',

	initialize: function(options){
		this.socketEvents = options.socketEvents;
		this.currentChatView = options.currentChatView;
		this.chats = options.chats;
		
		this.collection = new ProjectCollection();
		this.collection.url = options.url;
		ListView.prototype.initialize.apply(this,options);
	},

	getNewItemView: function(model){
		return new ProjectItemView({model: model,socketEvents: this.socketEvents});
	},

	// // currentChatView: null,
	// // chats: {},
	// startChatSession: function(model){
	// 	if(null != this.currentChatView){
	// 		this.currentChatView.undelegateEvents();
	// 	}

	// 	var roomId = model.get('accountId');
	// 	if(!this.chats[roomId]){
	// 		var chatCollection = new ChatCollection();
	// 		var chatView = new ChatView({
	// 				room: model,
	// 				collection: chatCollection,
	// 				socketEvents: this.socketEvents
	// 			});
	// 		chatView.render();
	// 		chatCollection.url = '/chats/' + roomId;
	// 		chatCollection.fetch();
	// 		this.chats[roomId] = chatView;
	// 	}else{
	// 		var view = this.chats[roomId];
	// 		view.delegateEvents();
	// 		view.render();
	// 		var collection = view.collection;
	// 		collection.trigger('reset',collection);
	// 	}

	// 	this.currentChatView = this.chats[roomId];
	// },
});
