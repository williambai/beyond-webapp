var _ = require('underscore');
var ListView = require('./__ListView'),
    ProjectItemView = require('./_ItemProject'),
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

});
