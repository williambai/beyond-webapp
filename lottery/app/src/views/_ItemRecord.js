var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    itemRecordTemplate = require('../../assets/templates/_itemRecord.tpl');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

		tagName: 'div',

		initialize: function(options){
			this.account = options.account;
		},

		render: function(){
			this.$el.html(itemRecordTemplate({record: this.model.toJSON(),account: this.account}));
			return this;
		}
	});


