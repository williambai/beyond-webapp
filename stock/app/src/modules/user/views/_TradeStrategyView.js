var _ = require('underscore');
var Backbone = require('backbone'),
	$ = require('jquery'),
    strategyTpl = require('../templates/_entityTradeStrategy.tpl'),
	TradeStrategy = require('../models/TradeStrategy');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#dataView',

	initialize: function(options) {
		this.router = options.router;
		this.model = new TradeStrategy({_id: options.id});
		var page = $(strategyTpl);
		var viewTemplate = $('#viewTemplate', page).html();
		this.template = _.template(_.unescape(viewTemplate || ''));
		this.model.on('change', this.change ,this);
		this.on('load', this.load, this);
	},

	events: {
		'click .edit': 'editStrategy',
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
	},

	editStrategy: function(evt){
		var id = this.$(evt.currentTarget).closest('.item').attr('id');
		this.router.navigate('trade/strategy/edit/'+ id,{trigger: true});
		return false;
	},

	back: function(){
		window.history.back();
		// this.router.navigate('data/index',{trigger: true, replace: true});
		return false;
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		return this;
	},
});