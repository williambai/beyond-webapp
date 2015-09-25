var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	ListView = require('./__ListView'),
    ChatItemView = require('./_ItemProjectChat'),
    Status = require('../models/Status'),
    StatusCollection = require('../models/StatusCollection');

Backbone.$ = $;

var modalTemplate = require('../../assets/templates/_modal.tpl');
require('./__ModalView');

exports = module.exports = ListView.extend({

	initialize: function(options){
		this.account = options.account;
		this.collection = new StatusCollection();
		this.collection.url = options.url;
		options.socketEvents.off('socket:in:project:chat');
		options.socketEvents.on(
				'socket:in:project:chat',
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
		var user = data.from;
		var project = data.to;
		var content = data.content;
		if(project.id == this.id){
			var status = new Status({
				fromId: user.id,
				toId: project.id,
				username: user.username,
				avatar: user.avatar,
				content: content,
			});

			this.collection.add(status);
			this.onChatAdded(status);
		}
	},

	// onChatAdded: function(chat){
	// 	var fromId = chat.get('fromId');
	// 	if(fromId == this.account.id) {
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
	// 		if(fromId == that.account.id) {
	// 			chat.set('from','me');
	// 		}
	// 		var chatItemHtml = (new ChatItemView({model: chat})).render().el;
	// 		$(chatItemHtml).prependTo('.chat_log').hide().fadeIn('fast');
	// 	});
	// 	this.$el.animate({scrollTop: this.$el.get(0).scrollHeight},1);
	// },

});