define(['text!templates/productAdd.html','text!templates/productEdit.html'], function(productAddTemplate,productEditTemplate){
	var ProductEditView = Backbone.View.extend({
		el: '#content',
		templateEdit: _.template(productEditTemplate),
		templateAdd: _.template(productAddTemplate),

		events: {
			'submit form': 'editProduct'
		},

		editProduct: function(){
			$.post('/products',{
				name: $('input[name=name]').val(),
				description: $('input[name=description]').val()
			},function success(){
				window.location.hash = 'products/root';
			},function failure(){
				console.log('-----');
			});
			return false;
		},

		render: function(){
			if(this.model._id){
				this.$el.html(this.templateEdit(this.model.toJSON()));	
			}else{
				this.$el.html(this.templateAdd());
			}
			return this;
		}

	});

	return ProductEditView;
});