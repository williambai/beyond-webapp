define(['text!templates/product.html'],function(productTemplate){
	var ProductView = Backbone.View.extend({
		tagName: 'li',
		$el: $(this.el),
		template: _.template(productTemplate),

		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}
	});
	return ProductView;
});