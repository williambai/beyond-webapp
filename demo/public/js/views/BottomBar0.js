define(['text!templates/bottomBar0.html'],function(bottomBarTemplate){
	var BottomBarView = Backbone.View.extend({

		className: 'bottom-bar',

		template: _.template(bottomBarTemplate),

		initialize: function(options){				
			this.id = options.id;
		},
		
		render: function(){
			this.$el.html(this.template({id: this.id}));
			this.$('a.chat-toggle').attr('href','#project/chat/'+ this.id);
			return this;
		}
	});
	return BottomBarView;
});