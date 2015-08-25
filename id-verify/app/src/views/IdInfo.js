var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    idInfoTemplate = require('../../assets/templates/idInfo.tpl'),
    IdInfo = require('../libs/IdInfo');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',
	events: {
		'submit form': 'baseInfo',
	},

	initialize: function(options){
		this.id = options.id;
		this.account = options.account;
		this.on('load', this.load,this);
	},

	load: function(){
		this.render();
	},

	baseInfo: function(){
		var card_id = this.$('input[name=card_id]').val();
		var card_name = this.$('input[name=card_name]').val();

		var idInfo = IdInfo.build(card_id);
		this.$('#result').html('<h4>校验结果：</h4>' + idInfo);
		this.$('input[name=card_id]').val('');
		this.$('input[name=card_name]').val('');
		return false;
	},

	render: function(){
		this.$el.html(idInfoTemplate());
		return this;
	}

});