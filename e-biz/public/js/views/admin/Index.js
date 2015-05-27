define(['text!templates/admin/index.html'],function(IndexTemplate){
	var IndexView = Backbone.View.extend({
		el: '#content',
		template: _.template(IndexTemplate),
		render: function(){
			this.$el.html(this.template());
			return this;
		}
	});

	return IndexView;
});