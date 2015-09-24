var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    orderIndexTemplate = require('../../assets/templates/orderIndex.tpl'),
    SearchOrderView = require('./_SearchOrder'),
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
	},

	load: function(){
		var that = this;
		this.orderListView = new OrderListView({
			account: this.account,
			url: config.api.host + '/orders'
		});
		this.searchOrderView = new SearchOrderView();
		this.searchOrderView.done = function(url){
			that.orderListView.trigger('refresh', url);
		};
		this.orderListView.trigger('load');
	},

	scroll: function(){
		this.orderListView.scroll();
		return false;
	},

	render: function(){
		this.$el.html(orderIndexTemplate({account: this.account}));
		return this;
	}
});