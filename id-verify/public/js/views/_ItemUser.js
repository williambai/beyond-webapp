define(['text!templates/_itemUser.tpl'], function(itemUserTemplate){
	var UserItemView = Backbone.View.extend({
			tagName: 'div',
			template: _.template(itemUserTemplate),

			initialize: function(options){
				this.account = options.account;
			},

			render: function(){
				this.$el.html(this.template({user: this.model.toJSON(),account: this.account}));
				return this;
			}
		});
	return UserItemView;

});