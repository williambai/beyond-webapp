define(['text!templates/products.html','views/Product'],function(productTemplate,ProductView){
	var ProductsView = Backbone.View.extend({
		el: '#content',
		template: _.template(productTemplate),

		initialize: function(){
			this.listenTo(this.collection,'reset', this.productCollectionReset);
			this.listenTo(this.collection,'add', this.productAdded);
		},

		productAdded: function(productModel){
			var productHtml = new ProductView({model: productModel}).render().el;
			this.$el.find('#productlist').append(productHtml);
		},

		productCollectionReset: function(collection){
			var that = this;
			collection.each(function(product){
				that.productAdded(product);
			});
		},

		render: function(){
			this.$el.html(this.template());
			return this;
		}
	});
	return ProductsView;
});