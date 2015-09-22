var _ = require('underscore');
var ListView = require('./__ListView'),
    StatusItemView = require('./_ItemStatus'),
    StatusCollection = require('../models/StatusCollection');

exports = module.exports = ListView.extend({
	
	el: '#status-list',

	initialize: function(options){
		this.account = options.account;

		this.collection = new StatusCollection();
		this.collection.url = options.url;
		ListView.prototype.initialize.apply(this,options);
	},

	getNewItemView: function(model){
		return new StatusItemView({account: this.account,model: model});
	},
});