define(['text!templates/loading.html','text!templates/index.html','views/ProjectWidget'],
	function(loadingTemplate,indexTemplate,ProjectWidget){

	var IndexView = Backbone.View.extend({
		el: '#content',
		template: _.template(indexTemplate),

		loaded: false,
		loadingTemplate: _.template(loadingTemplate),

		initialize: function(options){
			this.socketEvents = options.socketEvents;
			this.on('load', this.load, this);
		},

		load: function(){
			this.loaded = true;
			this.render();
			this.projectWidget = new ProjectWidget({
				el: '#project-widget',
				socketEvents: this.socketEvents
			});
			this.projectWidget.trigger('load');
		},

		render: function(){
			if(!this.loaded){
				this.$el.html(this.loadingTemplate);
			}else{
				this.$el.html(this.template());
			}
			return this;
		},
	});
	return IndexView;
});