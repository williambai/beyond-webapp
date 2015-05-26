define(['text!templates/productEdit.html'], function(productEditTemplate){
	var ProductEditView = Backbone.View.extend({
		el: '#content',
		template: _.template(productEditTemplate),

		initialize: function(){
			this.listenTo(this.model, 'change', this.render);
		},

		events: {
			'submit form': 'editProduct'
		},

		editProduct: function(){
			$.post('/products',{
				cid: $('input[name=cid').val(),
				name: $('input[name=name]').val(),
				description: $('input[name=description]').val()
			},function success(){
			},function failure(){
				console.log('-----');
			});
			window.history.back();
			return false;
		},

		render: function(){
			this.$el.html(this.template(this.model.toJSON()));	
			return this;
		}

	});

	return ProductEditView;
});