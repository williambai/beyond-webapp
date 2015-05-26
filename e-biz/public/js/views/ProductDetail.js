define(['text!templates/productDetail.html'],function(productDetailTemplate){
	var ProductDetailView = Backbone.View.extend({
		el: '#content',
		template: _.template(productDetailTemplate),

		initialize: function(){
			this.listenTo(this.model, 'change', this.render);
		},

		events: {
			'click .productEdit': 'editProduct',
			'click .productDetail': 'viewProduct'
		},

		editProduct: function(){
			var cid = this.$el.find('[cid]').attr('cid');
			window.location.hash = 'category/edit/' + cid;
			return false;
		},

		viewProduct: function(){

		},

		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
	});
	return ProductDetailView;
});