var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    itemOrderTemplate = require('../../assets/templates/_itemOrder.tpl');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

		tagName: 'div',

		events: {
			'click a[href="#"].remove': 'removeOrder',
		},

		initialize: function(options){
			this.account = options.account;
		},

		removeOrder: function(evt){
			var that = this;
			var current = evt.currentTarget;
			var id = $(current).attr('id');
			var sure = confirm('是否要删除？');
			if(sure){
				// this.model.destroy({
				// 	success: function(response){
				// 		that.$el.html('');
				// 	},
				// 	error: function(response){
				// 	}
				// });
				$.ajax({
					url: '/orders/'+ id,
					method: 'DELETE',
					success: function(response){
						that.$el.html('');
					},
					error: function(response){
					}
				});
			}
			return false;
		},

		render: function(){
			this.$el.html(itemOrderTemplate({order: this.model.toJSON(),account: this.account}));
			return this;
		}
	});


