define(['text!templates/loading.html','text!templates/profile.html','views/Status','models/Status','models/Account', 'models/StatusCollection'],
	function(loadingTemplate,profileTemplate,StatusView, Status, Account, StatusCollection){
	var ProfileView = Backbone.View.extend({
		el: '#content',
		template: _.template(profileTemplate),

		loaded: false,
		loadingTemplate: loadingTemplate,

		events: {
			'click .logout': 'logout',
			// 'submit form': 'postStatus'
		},

		uiControl: {},

		initialize: function(options){
			this.router = options.router;
			if(options.id == 'me') {
				this.uiControl.me = true;
			}else{
				this.uiControl.me = false;
			}
			this.socketEvents = options.socketEvents;
			this.model = new Account();
			this.model.url = '/accounts/'+ options.id;

			this.statusCollection = new StatusCollection();
			this.statusCollection.url = '/accounts/' + options.id +'/status';

			this.model.on('change',this.render,this);
			this.statusCollection.on('add', this.onStatusAdded, this);
			this.statusCollection.on('reset', this.onStatusCollectionReset, this);
			this.on('load',this.load,this);
		},

		load: function(){
			this.loaded = true;
			this.render();
			this.model.fetch();
			this.statusCollection.fetch();
		},

		logout: function(){
			$.get('/logout');
			this.router.trigger('logout');
			// this.socketEvents.trigger('app:logout');
			window.location.hash = 'login';
			return false;
		},

		// postStatus: function(){
		// 	var that = this;
		// 	var statusCollection = this.collection;
		// 	var statusText = $('input[name=status]').val();
		// 	$.post('/accounts/'+ this.model.get('_id') +'/status',{status: statusText},function(data){
		// 	});
		// 	var statusModel = new Status({status:statusText,name: {first:'我'}});
		// 	that.onStatusAdded(statusModel);
		// 	return false;
		// },

		onStatusAdded: function(statusModel){
			var statusHtml = (new StatusView({model: statusModel})).render().el;
			$(statusHtml).prependTo('.status-list').hide().fadeIn('slow');
		},

		onSocketStatusAdded: function(data){
			var newStatus = data.data;
			this.onStatusAdded(new Status({
				status: newStatus.status,
				name: newStatus.name
			}));
		},

		render: function(){
			if(!this.loaded){
				this.$el.html(this.loadingTemplate);
			}else{
				if(this.model.get('_id')){
					this.socketEvents.bind('status' + this.model.get('_id'), this.onSocketonStatusAdded, this);
				}
				this.$el.html(this.template({
					ui: this.uiControl,
					account: this.model.toJSON()
				}));
				// var that = this;
				// var statusCollection = this.model.get('status');
				// if(null != statusCollection){
				// 	_.each(statusCollection,function(statusJson){
				// 		var statusModel = new Status(statusJson);
				// 		that.onStatusAdded(statusModel);
				// 	});
				// }
			}
			return this;
		}
	});
	return ProfileView;
});