define(['text!templates/categoryEdit.html'], function(categoryAddTemplate){
	var CategoryAddView = Backbone.View.extend({
		el: '#content',
		template: _.template(categoryAddTemplate),

		events: {
			'submit form': 'addCategory'
		},
		initialize: function(){
			this.listenTo(this.model,'change',this.render);
		},

		addCategory: function(){
			if(this.model.get('_id')){
				$.ajax({
					url:'/categories/' + this.model.get('_id')
					,type: 'PUT'
					,data: {
						pid: $('input[name=pid').val(),
						name: $('input[name=name]').val(),
						description: $('input[name=description]').val()
					}
				}).done(function success(){
				}).fail(function failure(){
					console.log('-----');
				});
			}else{
				$.post('/categories',{
					pid: $('input[name=pid').val(),
					name: $('input[name=name]').val(),
					description: $('input[name=description]').val()
				},function success(){
				},function failure(){
					console.log('-----');
				});
			}
			window.history.back();
			return false;
		},

		render: function(){
			// if(this.model.get('_id')){
				this.$el.html(this.template(this.model.toJSON()));
			// }
			return this;
		}

	});

	return CategoryAddView;
});