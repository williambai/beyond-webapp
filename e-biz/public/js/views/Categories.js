define(['text!templates/categories.html', 'views/Category'],function(categoriesTemplate, CategoryView){
	var CategoriesView = Backbone.View.extend({
		el: '#content',
		template: _.template(categoriesTemplate),

		initialize: function(){
			this.listenTo(this.collection, 'add', this.categoryAdded);
			this.listenTo(this.collection, 'reset', this.categoryCollectionReset);
			this.listenTo(this.collection, 'remove', this.categoryRemoved);
		},
		
		categoryAdded: function(categoryModel){
			var categoryHtml = new CategoryView({model: categoryModel}).render().el;
			this.$el.find('#categorylist').append(categoryHtml);
		},

		categoryRemoved: function(categoryModel){
			console.log('+++');
			categoryModel.destroy();
		},

		categoryCollectionReset: function(collection){
			var that = this;
			collection.each(function(category){
				that.categoryAdded(category);
			});
		},

		render: function(){
			this.$el.html(this.template());
			return this;
		}
	});
	return CategoriesView;
});