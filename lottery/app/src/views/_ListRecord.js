var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    ItemRecordView = require('./_ItemRecord'),
    ListView = require('./__ListView'),
    RecordCollection = require('../models/RecordCollection');

Backbone.$ = $;
	
exports = module.exports = ListView.extend({
	el: '#recordlist',

	initialize: function(options){
		this.account = options.account;
		this.collection = new RecordCollection();
		this.collection.url = options.url;
		ListView.prototype.initialize.apply(this,options);
	},
	getNewItemView: function(model){
		return new ItemRecordView({model: model,account: this.account});
	},
});

