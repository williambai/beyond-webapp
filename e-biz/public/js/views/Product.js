define(['text!templates/product.html'],function(productTemplate){
	var ProductView = Backbone.View.extend({
		tagName: 'li',
		$el: $(this.el),
		template: _.template(productTemplate),

		events: {
			'click .productEdit': 'editProduct',
			'click .productDetail': 'viewProduct'
		},
		editProduct: function(){
			window.location.hash = 'product/edit/' + this.model.get('_id');
			return false;
		},

		viewProduct: function(){
			window.location.hash = 'product/view/' + this.model.get('_id');
			return false;
		},

		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}
	});
	return ProductView;
});