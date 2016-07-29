var _ = require('underscore');
var $ = require('jquery');
var	Backbone = require('backbone');
var config = require('../conf');
var ListView = require('./common/__ListView');
var Utils = require('./common/__Util');

Backbone.$ = $;
//** 模型
var Order = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/private/orders',	
	defaults: {
		customer: {},
		product: {},
		goods: {}
	},
});
//** 集合
var OrderCollection = Backbone.Collection.extend({
	model: Order,
	url: config.api.host + '/private/orders',
});
//** List子视图
var OrderListView = ListView.extend({
	el: '#list',
	template: _.template($('#tpl-me-order-item').html()),

	initialize: function(options){
		this.collection = new OrderCollection();
		ListView.prototype.initialize.apply(this,options);
	},
	getNewItemView: function(model){
		model.set('deltatime',Utils.transformTime(model.get('lastupdatetime')));
		var item = this.template({model: model.toJSON()});
		var $item = $(item);
		$item.find('img').attr('src', model.get('thumbnail'));
		var status = model.get('status');
		var paymentType = model.get('paymenttype');
		var payments = model.get('payment');	
		if(status == '成功'){
			if(paymentType && payments && payments instanceof Array){
				var paymentHtml = '<table class="table table-bordered"><caption>此单佣金发放计划表</caption><thead class="">';
				paymentHtml += '<th>时间(年月)</th>';
				paymentHtml += '<th>金额(元)</th>';
				// paymentHtml += '<th>状态</th>';
				paymentHtml += '</thead>';
				payments.forEach(function(payment){
					paymentHtml += '<tr>';
					paymentHtml += '<td>' + payment.month + '</td>';
					paymentHtml += '<td>' + payment.money + '</td>';
					// paymentHtml += '<td style="color:red;">' + payment.status + '</td>';
					paymentHtml += '</tr>';
				});
				paymentHtml += '</table>';
				$item.find('.payment').append(paymentHtml);
			}
		}	
		return $item.html();
	},
});

exports = module.exports = Backbone.View.extend({

	el: '#content',
	template: _.template($('#tpl-me-order-index').html()),

	initialize: function(options) {
		this.router = options.router;
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .view': 'orderView',
	},

	load: function() {
		var that = this;
		this.render();

		this.listView = new OrderListView({
			el: '#list',
		});
		this.listView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
		return false;
	},

	orderView: function(evt){
		var id = this.$(evt.currentTarget).parent().attr('id');
		this.router.navigate('order/view/'+ id,{trigger: true});
		return false;
	},
	
	render: function() {
		this.$el.html(this.template());
		return this;
	},
});