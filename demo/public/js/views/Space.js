define(['text!templates/loading.html','text!templates/space.html','views/ScrollableView','views/StatusForm','views/StatusList'],
	function(loadingTemplate,activityTemplate,ScrollableView,StatusFormView,StatusListView){

	var SpaceView = ScrollableView.extend({
		el: '#content',
		template: _.template(activityTemplate),

		loaded: false,
		loadingTemplate: _.template(loadingTemplate),

		events: {
			'click .editor-toggle': 'editorToggle',
			'scroll': 'scroll',
		},

		initialize: function(options){
			this.id = options.id;
			this.account = options.account;
			this.socketEvents = options.socketEvents;
			this.on('load', this.load, this);
		},

		load: function(){
			this.loaded = true;
			this.render();
			this.statusListView = new StatusListView({
				el: 'div.status-list',
				url: '/accounts/'+ this.id + '/status',
				id:this.id,
				account: this.account,
				socketEvents: this.socketEvents
			});
			this.statusListView.trigger('load');
		},

		editorToggle: function(){
			if(this.$('.status-editor form').length == 0){
				var statusFormView = new StatusFormView({
					el: '.status-editor',
					accountId: this.id
				});
				statusFormView.render();
				this.$('.status-editor form').addClass('');
				return false;
			}
			if(this.$('.status-editor form').hasClass('hidden')){
				this.$('.status-editor form').removeClass('hidden');
			}else{
				this.$('.status-editor form').addClass('hidden');
			}
			return false;
		},

		scroll: function(){
			this.statusListView.scroll();
			return false;
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
	return SpaceView;
});