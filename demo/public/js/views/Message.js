define(['text!templates/loading.html','text!templates/message.html','views/StatusForm','views/StatusList','views/Status1'],
	function(loadingTemplate,messageTemplate,StatusFormView,StatusListView,StatusView){

	var MessageView = Backbone.View.extend({
		el: '#content',
		template: _.template(messageTemplate),

		loaded: false,
		loadingTemplate: _.template(loadingTemplate),

		initialize: function(options){
			this.id = options.id;
			this.account = options.account;
			this.socketEvents = options.socketEvents;
			this.on('load', this.load, this);
		},

		load: function(){
			this.loaded = true;
			this.render();
			this.statuses = new StatusListView({
				StatusView: StatusView,
				el: 'div.status-list',
				url: '/accounts/'+ this.id + '/message',
				id:this.id,
				account: this.account,
				socketEvents: this.socketEvents
			});
			this.statuses.trigger('load');
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
	return MessageView;
});