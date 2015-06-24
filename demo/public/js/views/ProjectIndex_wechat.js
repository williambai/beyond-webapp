define(['text!templates/projectIndex_wechat.html','models/Project'], function(projectIndexTemplate,Project){
	var ProjectIndexView = Backbone.View.extend({
		el: '#content',
		template: _.template(projectIndexTemplate),

		initialize: function(options){
			this.pid = options.pid;
			this.model = new Project();
			this.model.url = '/projects/' + options.pid;
			this.model.on('change', this.render,this);
			this.on('load', this.load,this);
		},

		load: function(){
			this.model.fetch();
		},

		render: function(){
			this.$el.html(this.template({project: this.model.toJSON()}));
			return this;
		}
	});
	return ProjectIndexView;
});