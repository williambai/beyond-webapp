define(['text!templates/cart.html','views/CartItem'],function(cartTemplate,CartItemView){
	var CartView = Backbone.View.extend({
		el: '#content',
		template: _.template(cartTemplate),

		events: {
			'click .payment': 'createOrder'
		},

		initialize: function(){
			this.listenTo(this.collection,'reset', this.cartCollectionReset);
			this.listenTo(this.collection,'add', this.cartItemAdded);
		},

		createOrder: function(){
			window.locaiton.hash = '/orders';
			return false;
		},

		cartItemAdded: function(productModel){
			var cartItemHtml = new CartItemView({model: productModel}).render().el;
			this.$el.find('#productlist').append(cartItemHtml);
		},

		cartCollectionReset: function(collection){
			var that = this;
			collection.each(function(product){
				that.cartItemAdded(product);
			});
		},

		render: function(){
			this.$el.html(this.template());
			return this;
		}
	});
	return CartView;
});