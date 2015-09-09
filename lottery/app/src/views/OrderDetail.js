var _ = require('underscore');

var $ = require('jquery');
var Backbone = require('backbone');
var orderDetailTemplate = require('../../assets/templates/orderDetail.tpl');
var Order = require('../models/Order');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	events: {
		'click .print': 'print',
	},

	initialize: function(options){
		this.account = options.account;
		this.model = new Order();
		if(options.id != 'empty'){
			this.model.url = '/orders/' + options.id; 
			this.model.fetch();
		}
		this.model.on('change', this.render, this);
		this.on('load', this.load, this);		
	},

	load: function(){
		this.render();
	},

	print: function(){
		window.print();
		return false;
	},

	render: function(){
		this.$el.html(orderDetailTemplate({order: this.model.toJSON(),account: this.account}));
		return this;
	}

});