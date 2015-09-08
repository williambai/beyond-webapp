var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    orderIndexTemplate = require('../../assets/templates/orderIndex.tpl'),
    OrderListView = require('./_ListOrder');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({
	el: '#content',

	initialize: function(options){
		this.account = options.account;
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'submit form': 'search'
	},

	load: function(){
		this.orderListView = new OrderListView({
			account: this.account,
			url: config.api.host + '/orders'
		});
		this.orderListView.collectionUrl = config.api.host + '/orders';
		this.orderListView.trigger('load');
	},
	scroll: function(){
		this.orderListView.scroll();
		return false;
	},
	search: function(){
		var that = this;
		this.orderListView.$el.empty();
		var url = config.api.host + '/orders?type=search&from=' + $('input[name=from]').val() + '&to=' + $('input[name=to]').val() + '&searchStr=' + $('input[name=searchStr]').val();
		this.orderListView.collectionUrl = url;
		this.orderListView.collection.url = url;
		this.orderListView.collection.fetch({reset: true});
		return false;
	},

	render: function(){
		this.$el.html(orderIndexTemplate());
		return this;
	}
});