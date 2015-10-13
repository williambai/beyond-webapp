var _ = require('underscore');
var ListView = require('./__ListView'),
    ItemView = require('./_ItemProjectFriend'),
    FriendCollection = require('../models/FriendCollection');

exports = module.exports = ListView.extend({
	el: '#list',

	initialize: function(options){
		this.collection = new FriendCollection();
		this.collection.url = options.url;
		ListView.prototype.initialize.apply(this,options);
	},

	getNewItemView: function(model){
		return new ItemView({model: model});
	},

});