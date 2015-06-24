define(['text!templates/loading.html','views/Projects'],function(loadingTemplate,ProjectsView){
	var LayoutView = Backbone.View.extend({
		el: 'body',
		loadingTemplate: _.template(loadingTemplate),

		loaded: false,
		initialize: function(options){
			this.find('#content').html(this.loadingTemplate);
			this.appEvents = options.appEvents;
			this.appEvents.on('set:brand', this.updateBrand,this);
		},

		events: {
		},

		updateBrand: function(brand){
			this.$('.navbar-brand').text(brand || '');
		},

		render: function(){
			return this;
		}
	});
	return LayoutView;
});