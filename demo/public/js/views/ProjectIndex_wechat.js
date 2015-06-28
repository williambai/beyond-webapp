define(['text!templates/projectIndex_wechat.html','views/ProjectCheckIn_wechat','models/Project'], function(projectIndexTemplate,ProjectCheckInView,Project){
	var ProjectIndexView = Backbone.View.extend({
		el: '#content',
		template: _.template(projectIndexTemplate),

		initialize: function(options){
			this.pid = options.pid;
			this.appid = options.appid;
			this.model = new Project();
			this.model.url = '/projects/' + options.pid;
			this.model.on('change', this.render,this);
			this.on('load', this.load,this);
		},

		events: {
			'click .checkin': 'checkIn',
		},

		load: function(){
			this.model.fetch();
		},

		checkIn: function(){
			var that = this;
			$.ajax('/wechat/project/update?appid=' + this.appid + '&pid=' + that.model.get('_id'), {
				mathod: 'GET',
				success: function(data){
					var projectCheckInView = new ProjectCheckInView({model: that.model});
					projectCheckInView.render();
				},
				error: function(){
					window.location.reload();
				}
			});
			return false;
		},

		render: function(){
			this.$el.html(this.template({
					project: this.model.toJSON(),
					contacts_num: this.model.get('contacts') ? this.model.get('contacts').length : 0
				}));
			return this;
		}
	});
	return ProjectIndexView;
});