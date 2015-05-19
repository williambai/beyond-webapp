define(['text!templates/status.html'],function(statusTemplate){
	var StatusView = Backbone.View.extend({
		tagName: 'li',
		template: _.template(statusTemplate),
		render: function(){
			// this.$el.html(_.template(statusTemplate)(this.model.attributes));
			this.$el.html(this.template(this.model.attributes));
			return this;
		}
	});

	return StatusView;
});