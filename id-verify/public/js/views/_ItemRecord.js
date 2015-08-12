define(['text!templates/_itemRecord.tpl'], function(itemRecordTemplate){
	var UserItemView = Backbone.View.extend({
			tagName: 'div',
			template: _.template(itemRecordTemplate),

			initialize: function(options){
				this.account = options.account;
			},

			render: function(){
				this.$el.html(this.template({record: this.model.toJSON(),account: this.account}));
				return this;
			}
		});
	return UserItemView;

});