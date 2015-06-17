define(['text!templates/projectIndex.html','views/BottomBar0','models/Project'], function(projectIndexTemplate,BottomBarView,Project){
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
			//增加 bottom Bar
			if($('.navbar-absolute-bottom').length == 0){
				var bottomBarView = new BottomBarView({
						id: this.pid,
						account: this.account,
						socketEvents: this.socketEvents,
						parentView: this,
					});
				$(bottomBarView.render().el).prependTo('.app');
				if(!$('body').hasClass('has-navbar-bottom')){
					$('body').addClass('has-navbar-bottom');
				}
			}
			this.$el.html(this.template({project: this.model.toJSON()}));
			return this;
		}
	});
	return ProjectIndexView;
});