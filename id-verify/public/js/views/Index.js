define(['text!templates/index.tpl'], function(indexTemplate){
	var IndexView = Backbone.View.extend({
		el: '#content',
		template: _.template(indexTemplate),

		render: function(){
			this.$el.html(this.template());
			return this;
		}
	});
	return IndexView;
});