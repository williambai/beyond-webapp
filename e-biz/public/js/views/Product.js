define(['text!templates/product.html'],function(productTemplate){
	var ProductView = Backbone.View.extend({
		tagName: 'li',
		$el: $(this.el),
		template: _.template(productTemplate),

		events: {
			'click .productEdit': 'editProduct',
			'click .productDetail': 'viewProduct',
			'click .putCart': 'putCart'
		},
		editProduct: function(){
			window.location.hash = 'product/edit/' + this.model.get('_id');
			return false;
		},

		viewProduct: function(){
			window.location.hash = 'product/view/' + this.model.get('_id');
			return false;
		},

		putCart: function(){
			$.post('/cart',{
				_id: this.$el.find('[pid]').attr('pid'),
				name: this.$el.find('.name').text(),
				description: this.$el.find('.description').text()
			},function success(){
			},function failure(){
				console.log('-----');
			});
			window.location.hash = 'cart';
			return false;
		},

		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}
	});
	return ProductView;
});