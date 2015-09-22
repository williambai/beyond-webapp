var _ = require('underscore');
var ListView = require('./__ListView'),
    ContactItemView = require('./_ItemContact'),
    ContactCollection = require('../models/ContactCollection');

exports = module.exports = ListView.extend({
	el: '#list',

	initialize: function(options){
		this.collection = new ContactCollection();
		this.collection.url = options.url;
		ListView.prototype.initialize.apply(this,options);
	},

	getNewItemView: function(model){
		return new ContactItemView({model: model});
	},

});