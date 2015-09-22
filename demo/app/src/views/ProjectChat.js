var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    modalTemplate = require('../../assets/templates/_modal.tpl'),
    projectChatTemplate = require('../../assets/templates/chat.tpl'),
    BottomBarView = require('./_FormProjectChat'),
    ChatListView = require('./_ListProjectChat'),
    ChatItemView = require('./_ItemProjectChat'),
    Project = require('../models/Project'),
    Status = require('../models/Status'),
    StatusCollection = require('../models/StatusCollection');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	events: {
		'click .chat-content img': 'showInModal',
		'scroll': 'scroll',
	},

	initialize: function(options){
		this.pid = options.id;
		this.account = options.account;
		this.socketEvents = options.socketEvents;
		this.socketEvents.off('socket:in:project:chat');
		this.socketEvents.on(
				'socket:in:project:chat',
				this.socketReceiveChat, 
				this
			);
		this.model = new Project();
		this.model.url = '/projects/' + options.id;
		this.model.on('change', this.render,this);
		this.on('load', this.load, this);
	},

	load: function(){
		this.loaded = true;
		var that = this;
		this.model.fetch({
			success: function(model){
				if(that.account.id == model.get('accountId')){
					model.set('isOwner', true);
				}
				var url = '/statuses/project/' + that.pid;
				that.chatListView = new ChatListView({url: url});
				that.chatListView.trigger('load');
			}
		});
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

	scroll: function(){
		this.chatListView.scrollUp();
		return false;
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

	render: function(){
		//增加 bottom Bar
		if(this.model.get('_id') && $('.navbar-absolute-bottom').length == 0){
			var bottomBarView = new BottomBarView({
					id: this.id,
					project: this.model,
					account: this.account,
					socketEvents: this.socketEvents,
					parentView: this,
				});
			$(bottomBarView.render().el).prependTo('.app');
			if(!$('body').hasClass('has-navbar-bottom')){
				$('body').addClass('has-navbar-bottom');
			}
		}
		this.$el.html(projectChatTemplate({project: this.model.toJSON()}));
		return this;
	}

});