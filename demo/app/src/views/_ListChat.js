var _ = require('underscore');
var ListView = require('./__ListView'),
    ChatItemView = require('./_ItemChat'),
    Chat = require('../models/Chat'),
    StatusCollection = require('../models/StatusCollection');

exports = module.exports = ListView.extend({

	initialize: function(options){
		this.collection = new StatusCollection();
		this.collection.url = options.url;
		options.socketEvents.off('socket:in:chat');
		options.socketEvents.on(
				'socket:in:chat',
				this.socketReceiveChat, 
				this
			);
		ListView.prototype.initialize.apply(this,options);
	},

	getNewItemView: function(model){
		return new ChatItemView({model: model,account: this.account});
	},

	events: {
		'click .chat-content img': 'showInModal',
	},

	showInModal: function(evt){
		var targetType = $(evt.currentTarget).attr('target-type');			
		var targetData = $(evt.currentTarget).attr('target-data');
		if(targetType != 'image' && targetType != 'video'){
			window.open(targetData,'_blank');
			return false;
		}
		if(targetType == 'image'){
		    // Create a modal view class
	    	var Modal = Backbone.Modal.extend({
	    	  template: modalTemplate(),
	    	  cancelEl: '.bbm-button'
	    	});
			// Render an instance of your modal
			var modalView = new Modal();
			$('body').append(modalView.render().el);
			$('.bbm-modal__section').html('<img src="' + targetData +'">');
		}
		return false;
	},

	socketReceiveChat: function(data){
		if(data){
			var from = data.from;
			var to = data.to;
			var content = data.content;
			if(from.id == this.id){
				var chat = new Chat({
					fromId: from.id,
					toId: to.id,
					username: from.username,
					avatar: from.avatar,
					status: content,
				});
				chat.set('from', 'others');
				this.collection.add(chat);
				this.onChatAdded(chat);
			}	
		}
	},

	// onChatAdded: function(chat){
	// 	var fromId = chat.get('fromId');
	// 	if(fromId != this.id) {
	// 		chat.set('from','me');
	// 	}
	// 	var chatItemHtml = (new ChatItemView({model: chat})).render().el;
	// 	$(chatItemHtml).appendTo('.chat_log').hide().fadeIn('slow');
	// 	this.$el.animate({scrollTop: this.$el.get(0).scrollHeight});
	// },

	// onChatCollectionReset: function(collection){
	// 	var that = this;
	// 	$('.chat_log').empty();
	// 	collection.each(function(chat){
	// 		var fromId = chat.get('fromId');
	// 		if(fromId != that.id) {
	// 			chat.set('from','me');
	// 		}
	// 		var chatItemHtml = (new ChatItemView({model: chat})).render().el;
	// 		$(chatItemHtml).prependTo('.chat_log').hide().fadeIn('fast');
	// 	});
	// 	this.$el.animate({scrollTop: this.$el.get(0).scrollHeight},1);
	// },

});