define(['text!templates/category.html'],function(categoryTemplate){
	var CategoryView = Backbone.View.extend({
		tagName: 'li',
		$el: $(this.el),

		template: _.template(categoryTemplate),

		events: {
			'click .name': 'detail',
			'click .categoryAdd': 'categoryAdd',
			'click .productAdd': 'productAdd',
			'click .categoryEdit': 'categoryEdit',
			'click .categoryRemove': 'categoryRemove'
		},

		detail: function(){
			var cid = this.$el.find('[cid]').attr('cid');
			window.location.hash = 'categories/' + cid;
			return false;
		},

		categoryAdd: function(){
			var cid = this.$el.find('[cid]').attr('cid');
			window.location.hash = 'category/add/' + cid;
			return false;
		},

		categoryEdit: function(){
			var cid = this.$el.find('[cid]').attr('cid');
			window.location.hash = 'category/edit/' + cid;
			return false;
		},

		categoryRemove: function(){
			var cid = this.$el.find('[cid]').attr('cid');
			this.$el.remove();
			$.ajax({
					url: '/categories/'+ cid
					,type: 'DELETE'
					,data: {
					}
				}).done(function onSuccess(){
					// $responseArea.text('移除成功！')
				}).fail(function onError(){
					// $responseArea.text('移除失败');
				});
			this.model.destroy();
			return false;
		},

		productAdd: function(){
			var cid = this.$el.find('[cid]').attr('cid');
			window.location.hash = 'product/add/' + cid;
			return false;
		},

		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
	});
	return CategoryView;
});