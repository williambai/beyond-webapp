var _ = require('underscore');
var ListView = require('./__ListView'),
    StatusItemView = require('./_ItemProjectStatus'),
    StatusCollection = require('../models/StatusCollection');

exports = module.exports = ListView.extend({

	initialize: function(options){

		this.collection = new StatusCollection();
		this.collection.url = options.url;
		ListView.prototype.initialize.apply(this,options);
	},

	getNewItemView: function(model){
		return new StatusItemView({model: model});
	},
});