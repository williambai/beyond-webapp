define(['text!templates/loading.html','text!templates/activity.html','views/_FormStatus','views/_ListStatus'],
	function(loadingTemplate,activityTemplate,StatusFormView,StatusListView){

	var ActivityView = Backbone.View.extend({
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
			if(options.socketEvents){
				options.socketEvents.on('socket:in:status',this.onSocketStatusAdded, this);
			}
			this.on('load', this.load, this);
		},

		load: function(){
			this.loaded = true;
			this.render();
			this.statusListView = new StatusListView({
				el: 'div.status-list',
				url: '/messages/account/activity/'+ this.id,
				account: this.account,
			});
			this.statusListView.trigger('load');
		},

		editorToggle: function(){
			if(this.$('.status-editor form').length == 0){
				var statusFormView = new StatusFormView({
					el: '.status-editor',
				});
				statusFormView.on('form:submit', this.statusFormSubmit, this);
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

		onSocketStatusAdded: function(data){
			var from = data.from;
			var content = data.content;
			var status = {};
			status.fromId = from.id;
			status.fromUser = {};
			status.fromUser[from.id] = from;
			status.content = content;
			this.statusListView.collection.trigger('add:prepend',status);
		},

		statusFormSubmit: function(form){
			var text = form.text;
			var attachments = form.attachments;

			var data = {
				MsgType: 'mixed',
				Content: text,
				Urls: attachments
			};

			var status = {};
			status.fromId = this.account.id;
			status.fromUser = {};
			status.fromUser[this.account.id] = this.account;
			status.content = data;

			this.statusListView.collection.trigger('add:prepend',status);

			this.socketEvents.trigger('socket:out:status', data);

			// $.ajax({
			// 	url: '/messages/account/'+ that.accountId,
			// 	type: 'POST',
			// 	data: {
			// 			status: statusText,
			// 			attachments: attachments
			// 		}
			// 	}).done(function(data){
			// 		$('textarea[name=text]').val('');
			// 		that.$('input[name=file]').val('');
			// 		that.$('.attachments').empty();
			// 		that.$('form').addClass('hidden');
			// 	});

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
	return ActivityView;
});