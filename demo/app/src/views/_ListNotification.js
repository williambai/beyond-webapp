var _ = require('underscore');
var ListView = require('./__ListView'),
    itemTemplate = require('../../assets/templates/_itemNotification.tpl'),
    NotificationCollection = require('../models/NotificationCollection');

exports = module.exports = ListView.extend({
	el: '#list',

	initialize: function(options){
		this.collection = new NotificationCollection();
		this.collection.url = options.url;
		ListView.prototype.initialize.apply(this,options);
	},

	getNewItemView: function(model){
		var ItemView = Backbone.View.extend({
			render: function(){
				this.$el.html(itemTemplate(this.model.toJSON()));
				return this;
			},
		});
		return new ItemView({model:model});
	},

});