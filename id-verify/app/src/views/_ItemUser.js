var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    itemUserTemplate = require('../../assets/templates/_itemUser.tpl');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({
		tagName: 'div',

		initialize: function(options){
			this.account = options.account;
		},

		render: function(){
			this.$el.html(itemUserTemplate({user: this.model.toJSON(),account: this.account}));
			return this;
		}
	});

