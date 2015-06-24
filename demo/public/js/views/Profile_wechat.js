define(['text!templates/loading.html','text!templates/profile_wechat.html','views/Status','models/Status','models/Account', 'models/StatusCollection'],
	function(loadingTemplate,profileTemplate,StatusView, Status, Account, StatusCollection){
	var ProfileView = Backbone.View.extend({
		el: '#content',
		template: _.template(profileTemplate),

		loaded: false,
		loadingTemplate: loadingTemplate,

		events: {
			'click .logout': 'logout',
		},

		initialize: function(options){
			this.appEvents = options.appEvents;
			this.socketEvents = options.socketEvents;
			this.model = new Account();
			this.model.url = '/accounts/'+ options.id;
			this.model.on('change',this.render,this);
			this.on('load',this.load,this);
		},

		load: function(){
			this.loaded = true;
			this.render();
			this.model.fetch();
		},

		logout: function(){
			$.get('/logout');
			this.appEvents.trigger('logout');
			window.location.hash = 'login';
			return false;
		},

		render: function(){
			if(!this.loaded){
				this.$el.html(this.loadingTemplate);
			}else{
				this.$el.html(this.template({
					account: this.model.toJSON()
				}));
			}
			return this;
		}
	});
	return ProfileView;
});