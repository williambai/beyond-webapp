var _ = require('underscore');
var Backbone = require('backbone'),
	$ = require('jquery'),
    pushTpl = require('../templates/_entityPush.tpl'),
	ProductDirect = require('../models/ProductDirect');
var config = require('../conf');

Backbone.$ = $;

var OrderView = require('./_DataOrder');

exports = module.exports = Backbone.View.extend({

	el: '#pushView',

	initialize: function(options) {
		this.router = options.router;
		this.model = new ProductDirect({_id: options.id});
		var page = $(pushTpl);
		var viewTemplate = $('#viewTemplate', page).html();
		this.template = _.template(_.unescape(viewTemplate || ''));
		this.model.on('change', this.change ,this);
		this.on('load', this.load, this);
	},

	events: {
		'click .back': 'back',
	},

	load: function(){
		this.model.fetch({
			xhrFields: {
				withCredentials: true
			},
		});
	},

	change: function(){
		this.render();
		this.orderView = new OrderView({
			router: this.router,
			el: '#orderView',
			product: this.model,
		});
		this.orderView.on('ready',this.orderViewReady,this);
		this.orderView.trigger('load');
	},

	orderViewReady: function(){
		// var goods = this.model.get('goods');
		// this.$('form').prepend('<input type="hidden" name="product[id]" value="'+ this.model.get('_id') + '">');
		// this.$('form').prepend('<input type="hidden" name="product[name]" value="'+ this.model.get('subject') + '">');
		// this.$('form').prepend('<input type="hidden" name="product[category]" value="'+ this.model.get('category') + '">');
		// this.$('form').prepend('<input type="hidden" name="goods[name]" value="'+ goods.name + '">');
		// this.$('form').prepend('<input type="hidden" name="goods[nickname]" value="'+ goods.nickname + '">');
		// this.$('form').prepend('<input type="hidden" name="goods[sourceId]" value="'+ goods.sourceId + '">');
	},

	back: function(){
		window.history.back();
		// this.router.navigate('push/index',{trigger: true, replace: true});
		return false;
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		return this;
	},
});