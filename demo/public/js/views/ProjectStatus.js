define(['text!templates/projectStatus.html','views/BottomBar0','views/Status','models/Project','models/Status','models/StatusCollection'],function(projectStatusTemplate,BottomBarView,StatusView,Project,Status,StatusCollection){
	var ProjectStatusView = Backbone.View.extend({
		el: '#content',
		template: _.template(projectStatusTemplate),
		page: 0,
		collectionUrl: '',
		events: {
			'click .editor-toggle': 'editorToggle',
			'submit form': 'updateStatus',
			'scroll': 'scroll',
		},
		
		initialize: function(options){
			this.pid = options.pid;
			// options.socketEvents.bind('status:me',this.onSocketStatusAdded, this);
			this.collection = new StatusCollection();
			this.collection.url = '/projects/'+ this.pid +'/status';
			this.collectionUrl = this.collection.url;
			this.collection.on('add', this.onStatusAdded, this);
			this.collection.on('reset', this.onStatusCollectonReset, this);
			this.on('load', this.load, this);
		},

		load: function(){
			this.collection.fetch();
		},

		onSocketStatusAdded: function(data){
			var newStatus = data.data;
			this.collection.add(new Status({status: newStatus.status, name: newStatus.name}));
		},

		onStatusCollectonReset: function(collection){
			var that = this;
			collection.each(function(model){
				that.onStatusAdded(model);
			});
		},

		onStatusAdded: function(status){
			var statusHtml = (new StatusView({model: status})).render().el;
			$(statusHtml).appendTo('.status_list').hide().fadeIn('slow');
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
			$.post('/projects/'+ this.pid +'/status',{text: statusText},function(data){
				// statusCollection.add(new Status({status: statusText,name:{first:'我'}}));
			});
			// var statusModel = new Status({status:statusText,name: {first:'我'}});
			// this.onStatusAdded(statusModel);
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
			this.$el.html(this.template({model:{_id: this.pid, name: '待定'}}));
			return this;
		},
	});
	return ProjectStatusView;
});