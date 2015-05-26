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
			window.location.hash = 'categoryAdd/' + cid;
			return false;
		},

		categoryRemove: function(){
			var cid = this.$el.find('[cid]').attr('cid');
			this.$el.remove();
			this.model.destroy();
			return false;
		},

		productAdd: function(){
			var cid = this.$el.find('[cid]').attr('cid');
			window.location.hash = 'productEdit/' + cid;
			return false;
		},

		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
	});
	return CategoryView;
});