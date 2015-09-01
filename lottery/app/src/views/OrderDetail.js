var _ = require('underscore');

var $ = require('jquery');
var Backbone = require('backbone');
var orderDetailTemplate = require('../../assets/templates/orderDetail.tpl');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	events: {
		'click .print': 'print',
	},

	print: function(){
		window.print();
		return false;
	},

	render: function(){
		this.$el.html(orderDetailTemplate());
		return this;
	}

});