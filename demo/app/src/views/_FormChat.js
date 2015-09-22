var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    bottomBarTemplate = require('../../assets/templates/_formChat.tpl'),
    Chat = require('../models/Chat');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	className: 'bottom-bar',

	initialize: function(options){				
		this.id = options.id;
		this.account = options.account;
		this.socketEvents = options.socketEvents;
		this.parentView = options.parentView;
	},

	events: {
		'submit form': 'sendChat',
		'click .send-file': 'showFileExplorer',
		'change input[name=file]': 'uploadFile',
	},

	sendChat: function(){
		var chatText = $('input[name=chat]').val();
		if(chatText && /[^\s]+/.test(chatText)){
			var chatObject = {
				fromId: 'me',
				toId: this.id,
				username: '我：',
				avatar: this.account.avatar,
				status: chatText
			};
			var chat = new Chat(chatObject);
			this.parentView.collection.add(chat);
			this.parentView.onChatAdded(chat);

			this.socketEvents.trigger('socket:out:chat',{
				to: {
					id: this.id
				},
				content: chatText
			});
		}
		$('input[name=chat]').val('');
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
					var chatText = 'http://' + location.host + '/' + data.filename;
					// if(/jpg|png/.test(data.type)){
						var chatObject = {
							fromId: 'me',
							toId: that.id,
							username: '我：',
							avatar: that.account.avatar,
							status: chatText
						};
						var chat = new Chat(chatObject);
						that.parentView.collection.add(chat);
						that.parentView.onChatAdded(chat);

						that.socketEvents.trigger('socket:out:chat',{
							to: {
								id: this.id
							},
							content: chatText
						});
						
						// that.socketEvents.trigger('socket:chat',{
						// 	action: 'chat',
						// 	to: that.id,
						// 	text: chatText
						// });
						that.$('input[name=file]').val('');
					// }
				}
			},
			error: function(err){
				that.$('input[name=file]').val('');
				console.log(err);
			},
		});
      	return false;
	},

	render: function(){
		this.$el.html(bottomBarTemplate());
		return this;
	}
});