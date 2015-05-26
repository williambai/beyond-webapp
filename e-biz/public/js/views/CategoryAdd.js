define(['text!templates/categoryAdd.html'], function(categoryAddTemplate){
	var CategoryAddView = Backbone.View.extend({
		el: '#content',
		template: _.template(categoryAddTemplate),

		events: {
			'submit form': 'addCategory'
		},

		addCategory: function(){
			$.post('/categories',{
				pid: $('input[name=pid').val(),
				name: $('input[name=name]').val(),
				description: $('input[name=description]').val()
			},function success(){
				window.location.hash = 'categories/root';
			},function failure(){
				console.log('-----');
			});
			return false;
		},

		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}

	});

	return CategoryAddView;
});