define(['text!templates/chatItem.html'],function(chatItemTemplate){
	var ChatItemView = Backbone.View.extend({
		tagName: 'div',
		template: _.template(chatItemTemplate),

		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}
	});

	return ChatItemView;
});