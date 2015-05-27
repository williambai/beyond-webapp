define(['text!templates/cartItem.html'],function(CartItemTemplate){
	var ProductView = Backbone.View.extend({
		tagName: 'li',
		$el: $(this.el),
		template: _.template(CartItemTemplate),

		events: {
			'click .itemRemove': 'itemRemove',
		},

		itemRemove: function(){
			this.model.destroy();
			return false;
		},

		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}
	});
	return ProductView;
});