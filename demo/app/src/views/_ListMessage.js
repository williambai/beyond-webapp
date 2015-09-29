var _ = require('underscore');
var ListView = require('./__ListView'),
    MessageItemView = require('./_ItemMessage'),
    MessageCollection = require('../models/MessageCollection');

exports = module.exports = ListView.extend({

	initialize: function(options){
		this.account = options.account;
		this.collection = new MessageCollection();
		this.collection.url = options.url;
		ListView.prototype.initialize.apply(this,options);
	},

	getNewItemView: function(model){
		return new MessageItemView({account: this.account,model: model});
	},
});