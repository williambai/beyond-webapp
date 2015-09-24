var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    ItemUserView = require('./_ItemUser'),
    ListView = require('./__ListView'),
    AccountCollection = require('../models/AccountCollection');

Backbone.$ = $;

exports = module.exports = ListView.extend({
	
	el: '#userlist',

	initialize: function(options){
		this.account = options.account;
		this.collection = new AccountCollection();
		this.collection.url = options.url;
		ListView.prototype.initialize.apply(this,options);
	},
	getNewItemView: function(model){
		return new ItemUserView({model: model,account: this.account});
	},
});