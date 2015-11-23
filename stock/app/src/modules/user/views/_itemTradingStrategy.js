var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    itemTemplate = require('../templates/_itemTradingStrategy.tpl');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

		tagName: 'div',

		initialize: function(options){
		},

		render: function(){
			this.$el.html(itemTemplate({model: this.model.toJSON()}));
			return this;
		}
	});

