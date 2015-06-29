define(['text!templates/loading.html','text!templates/statuses.html','views/Status','models/Status','models/StatusCollection'],
	function(loadingTemplate,statusesTemplate,StatusView,Status,StatusCollection){
	var StatusesView = Backbone.View.extend({
		el: '#content',
		template: _.template(statusesTemplate),

		loaded: false,
		loadingTemplate: _.template(loadingTemplate),

		page: 0,
		uiControl: {},

		collectionUrl: '',

		events: {
			'click .editor-toggle': 'editorToggle',
			'submit form': 'updateStatus',
			'click .next-page': 'nextPage',
			'scroll': 'scroll',
		},
		
		initialize: function(options){
			this.accountId = options.id;
			options.socketEvents.bind('status:me',this.onSocketStatusAdded, this);

			this.collection = new StatusCollection();
			if(options.statusType == 'activity'){
				this.collection.url = '/accounts/'+ options.id + '/activity';
				this.collectionUrl = this.collection.url;
				this.uiControl.statusType = 'activity';
			}else if(options.statusType == 'message'){
				this.collection.url = '/accounts/'+ options.id + '/message';
				this.collectionUrl = this.collection.url;
				this.uiControl.statusType = 'message';
			}else{
				this.collection.url = '/accounts/'+ options.id + '/status';
				this.collectionUrl = this.collection.url;
				this.uiControl.statusType = 'status';
			}
			this.collection.on('add', this.onStatusAdded, this);
			this.collection.on('reset', this.onStatusCollectonReset, this);
			this.on('load', this.load, this);
		},

		load: function(){
			this.loaded = true;
			this.render();
			this.collection.fetch();
		},

		onSocketStatusAdded: function(data){
			var fromId = data.from;
			data = data.data;
			var status = new Status({
					fromId: fromId,
					username: data.username,
					avatar: data.avatar,
					status: data.status
				});
			//新进来的Status加在前面
			var statusHtml = (new StatusView({model: status})).render().el;
			$(statusHtml).prependTo('.status-list').hide().fadeIn('slow');
			this.collection.add(status,{silent: true});
		},

		onStatusCollectonReset: function(collection){
			var that = this;
			collection.each(function(model){
				that.onStatusAdded(model);
			});
		},

		onStatusAdded: function(status){
			var statusHtml = (new StatusView({model: status})).render().el;
			$(statusHtml).appendTo('.status-list').hide().fadeIn('slow');
		},

		editorToggle: function(){
			if(this.$('.status-editor').hasClass('hidden')){
				this.$('.status-editor').removeClass('hidden').hide().fadeIn('slow');
			}else{
				this.$('.status-editor').addClass('hidden').hide().fadeOut('slow');
			}
		},

		updateStatus: function(){
			var statusCollection = this.collection;
			var statusText = $('textarea[name=text]').val();
			$.post('/accounts/'+ this.accountId +'/status',
				{
					status: statusText
				},
				function(data){
			});
			$('textarea[name=text]').val('');
			this.$('.status-editor').addClass('hidden').hide().fadeOut('slow');
			return false;
		},

		nextPage: function(){
			++this.page;
			this.collection.url = this.collectionUrl + '?page=' + this.page;
			this.collection.fetch();
		},

		scroll: function(){
			 viewH =this.$el.height(),//可见高度  
             contentH =this.$el.get(0).scrollHeight,//内容高度  
             scrollTop =this.$el.scrollTop();//滚动高度  
            if(contentH - viewH - scrollTop <= 100) { //到达底部100px时,加载新内容
            	this.nextPage();
            }
		},

		render: function(){
			if(!this.loaded){
				this.$el.html(this.loadingTemplate);
			}else{
				this.$el.html(this.template({ui: this.uiControl}));
			}
			return this;
		},
	});
	return StatusesView;
});