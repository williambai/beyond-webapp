var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    ItemRecordView = require('./_ItemTradingRecord'),
    ListView = require('./__ListView'),
    RecordCollection = require('../models/TradingRecordCollection');

Backbone.$ = $;
	
exports = module.exports = ListView.extend({
	el: '#list',

	initialize: function(options){
		this.collection = new RecordCollection();
		ListView.prototype.initialize.apply(this,options);
	},
	getNewItemView: function(model){
		return new ItemRecordView({model: model});
	},
});

