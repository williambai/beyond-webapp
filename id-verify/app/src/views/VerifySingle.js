var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    verifySingleTemplate = require('../../assets/templates/verifySingle.tpl'),
    itemVerifyTemplate = require('../../assets/templates/_itemVerify.tpl');

Backbone.$ = $;


exports = module.exports = Backbone.View.extend({

	el: '#content',

	events: {
		'submit form': 'verify',
	},

	limits: {},

	initialize: function(options){
		this.id = options.id;
		this.account = options.account;
		this.on('load', this.load,this);
	},

	load: function(){
		var that = this;
		$.ajax('persons/times?type=verify', {
			method: 'GET',
			success: function(data){
				var limits = data.account || {};
				var times = limits.times || -1;
				that.limits.times = times;
				var price = limits.price || 2;
				that.limits.price = price;
				that.render();
			}
		});
	},

	verify: function(){
		var that = this;
		var card_id = this.$('input[name=card_id]').val();
		var card_name = this.$('input[name=card_name]').val();

		var pairs = [{card_id: '610125197004201212',card_name: '白卫'},{card_id: 1,card_name: 'test1'},{card_id:11,card_name: 'test11'}];

		$.ajax('/persons/check?type=verify', {
			method: 'POST',
			dataType: 'json',
			// data: {
			// 	type: 'base',
			// 	persons: {
			// 		card_id: card_id,
			// 		card_name: card_name
			// 	}
			// },
			data: {
				type: 'base',
				persons: pairs
			},
			success: function(data){
				if(data.errcode){
					that.$('#result').html('错误消息：' + data.errmsg);
				}else{
					var limits = data.account || {};
					var times = limits.times || -1;
					if(times > 0){
						that.$('.times').html('您当前还可以查询 ' + times +' 条')
					}
					var person = (data.persons && data.persons[0]) || {};
					that.$('#result').html(itemVerifyTemplate({person: person}));
				}
			},
			error: function(){

			}
		});
		this.$('input[name=card_id]').val('');
		this.$('input[name=card_name]').val('');
		return false;
	},

	render: function(){
		this.$el.html(verifySingleTemplate());
		if(this.limits.times > 0){
			this.$('.times').html('您当前还可以查询 ' + this.limits.times +' 条')
		}
		if(this.limits.price > 0){
			this.$('.price').html('<p>价格：' + this.limits.price + '.00 元/条</p>');
		}
		return this;
	}

});