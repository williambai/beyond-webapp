var _ = require('underscore');
var Backbone = require('backbone'),
	$ = require('jquery'),
    exchangeTpl = require('../templates/_entityExchange.tpl'),
	ProductExchange = require('../models/ProductExchange');
var config = require('../conf');

Backbone.$ = $;

var ExchangeAddView = require('./_ExchangeAdd');

exports = module.exports = Backbone.View.extend({

	el: '#exchangeView',

	initialize: function(options) {
		this.router = options.router;
		this.model = new ProductExchange({_id: options.id});
		var page = $(exchangeTpl);
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
		this.exchangeAddView = new ExchangeAddView({
			router: this.router,
			el: '#addView',
			product: this.model,
		});
		this.exchangeAddView.on('ready',this.exchangeAddViewReady,this);
		this.exchangeAddView.trigger('load');
	},

	exchangeAddViewReady: function(){
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
		// this.router.navigate('exchange/index',{trigger: true, replace: true});
		return false;
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		return this;
	},
});