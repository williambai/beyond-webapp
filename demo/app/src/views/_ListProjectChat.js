var _ = require('underscore');
var ListView = require('./__ListView'),
    ChatItemView = require('./_ItemProjectChat'),
    StatusCollection = require('../models/StatusCollection');

exports = module.exports = ListView.extend({
	el: 'div.chat_log',

	initialize: function(options){
		this.collection = new StatusCollection();
		this.collection.url = options.url;
		ListView.prototype.initialize.apply(this,options);
	},

	getNewItemView: function(model){
		return new ChatItemView({model: model});
	},

});