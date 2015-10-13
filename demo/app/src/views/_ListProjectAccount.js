var _ = require('underscore');
var ListView = require('./__ListView'),
    ItemView = require('./_ItemProjectAccount'),
    FriendCollection = require('../models/FriendCollection');

exports = module.exports = ListView.extend({
	el: '#list',

	initialize: function(options){
		this.pid = options.pid;
		this.collection = new FriendCollection();
		this.collection.url = options.url;
		ListView.prototype.initialize.apply(this,options);
	},

	getNewItemView: function(model){
		return new ItemView({model: model, pid: this.pid});
	},

});