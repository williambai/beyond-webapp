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
			this.collectionUrl = options.url;
			this.collection.on('reset', this.onCollectionReset,this);
			this.collection.on('add', this.append, this);
			this.on('load', this.load, this);
		},

		load: function(){
			this.loaded = true;
			this.render();
			this.collection.fetch({reset: true});
		},

		onCollectionReset: function(collection){
			var that = this;
			collection.each(function(model){
				that.append(model);
			});
		},

		append: function(model){
			var html = (new ItemRecordView({model: model,account: this.account})).render().el;
			this.$el.append(html);
		},

		render: function(){
			return this;
		},
	});

