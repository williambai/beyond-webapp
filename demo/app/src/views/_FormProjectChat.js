var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    menuBarTemplate = require('../../assets/templates/_barProject.tpl'),
    chatFormTemplate = require('../../assets/templates/_formProjectChat.tpl'),
    FormView = require('./__FormView'),
    Chat = require('../models/ProjectStatus');

Backbone.$ = $;

exports = module.exports = FormView.extend({

	className: 'bottom-bar',

	initialize: function(options){				
		this.id = options.id;
		this.project = options.project;
		this.account = options.account;
		this.socketEvents = options.socketEvents;
		this.parentView = options.parentView;
	},

	barToggle: true,
	
	events: {
		'submit form': 'sendChat',
		'click .send-file': 'showFileExplorer',
		'change input[name=file]': 'uploadFile',
		'click .chat-toggle': 'changeToolbar'
	},

	sendChat: function(){
		var that = this;
		var chatText = $('input[name=chat]').val();
		if(chatText && /[^\s]+/.test(chatText)){
			var chat = new Chat();
			chat.url = '/statuses/project/' + this.id;
			chat.set('type','text');
			chat.set('content',
				{
					body: chatText
				}
			);
			if(chat.isValid()){
				// that.socketEvents.trigger('socket:out:project',{
				// 	to: {
				// 		id: that.id
				// 	},
				// 	content: chat.toJSON(),
				// });
				var xhr = chat.save();
				if(xhr){
					xhr
						.success(function(model){
							if(!!model.code){
								console.log(model);
								return;
							}
							$('input[name=chat]').val('');
							that.success(new Chat(model));
						})
						.error(function(err){
							console.log(err);
						});
				}				
			}

		}
		return false;
	},

	showFileExplorer: function(){
		$('input[name=file]').click();
		return false;
	},

	uploadFile: function(evt){
		var that = this;
		var formData = new FormData();
		formData.append('files',evt.currentTarget.files[0]);
		$.ajax({
			url: '/attachments',
			type: 'POST',
			data: formData,
			cache: false,//MUST be false
			processData: false,//MUST be false
			contentType:false,//MUST be false
			success: function(data){
				if(data && data.type){
					var content = 'http://' + location.host + data.filename;
					// if(/jpg|png/.test(data.type)){
						var status = new Status({
							fromId: that.account.id,
							toId: that.id,
							username: that.account.username,
							avatar: that.account.avatar,
							content: content
						});
						that.parentView.collection.add(status);
						that.parentView.onChatAdded(status);
					
						that.socketEvents.trigger('socket:out:project',{
							to: {
								id: that.id
							},
							content: content,
						});
					// }
				}
				that.$('input[name=file]').val('');
			},
			error: function(err){
				that.$('input[name=file]').val('');
				console.log(err);
			},
		});
      	return false;
	},

	changeToolbar: function(){
		this.barToggle = !this.barToggle;
		if(this.barToggle){
			window.location.hash = 'project/chat/' + this.id;
		}
		this.render();
		return false;
	},

	render: function(){
		if(this.barToggle){
			this.$el.html(chatFormTemplate({project: this.project.toJSON()}));
		}else{
			this.$el.html(menuBarTemplate({id: this.id}));
		}
		return this;
	}
});