var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    statusTemplate = require('../templates/_itemStatus.tpl'),
    commentFormTemplate = require('../templates/_formComment.tpl'),
    modalTemplate = require('../templates/_modal.tpl'),
    MessageUtil = require('./__Util');
var config = require('../conf');

Backbone.$ = $;
require('./__ModalView');

exports = module.exports = Backbone.View.extend({

	// tagName: 'li',

	templateGood: '<hr><p class="has-good"><i class="fa fa-heart-o"></i>&nbsp;<span class="user-list"></span></p>',
	templateExpand: '<a class="expand"><p>展开</p></a>',
	templatePackup: '<a class="packup"><p>收起</p></a>',

	events: {
		'click .good': 'voteGood',
		'click .comment-toggle': 'commentToggle',
		'submit form': 'submitComment',
		'click .expand': 'expand',
		'click .packup': 'packup',

		'click .media-body img': 'showInModal',
	},

	initialize: function(options){
		this.account = options.account;
		this._convertContent();
		this._transformTime();
		// this._transformAvatar();
	},

	_convertContent: function(){
		var type = this.model.get('type');
		var contentObject = this.model.get('content');
		var newContent = MessageUtil.buildContent(type, contentObject);
		// var newContent = MessageUtil.convertContent(contentObject);
		this.model.set('content',newContent);
	},

	_transformTime: function(){
		var createtime = this.model.get('lastupdatetime');
		var deltatime = MessageUtil.transformTime(createtime);
		this.model.set('deltatime', deltatime);
	},

	// _transformAvatar: function(){
	// 	var fromId = this.model.get('fromId');
	// 	var fromUser = this.model.get('fromUser');
	// 	if(fromUser && fromId){
	// 		this.model.set('avatar', fromUser[fromId].avatar);
	// 		this.model.set('username', fromUser[fromId].username);
	// 	}
	// },

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

	voteGood: function(){
		var that = this;
		var url = this.model.url;
		this.model.url = config.api.host + '/account/statuses/' + this.model.get('_id')  + '?type=vote';
		var success = this.model.save({vote:'good'},{patch: true});
		if(success){
			that.onVoterAdded({
				accountId: that.account.id,
				username: that.account.username
			});
		};
		this.model.url = url;
		return false;
	},

	onVoterAdded: function(voter){
		var that = this;
		if(that.$('.has-good').length == 0){
			that.$('.comments').before(that.templateGood);
		}
		that.$('.user-list').append('&nbsp;<a href="#profile/'+ voter.accountId +'">'+ voter.username +'</a>;');
	},

	onCommenAdded: function(comment){
		this.$('.comments').append('<p><a href="#profile/'+ comment.uid +'">'+ comment.username + '</a>: ' + comment.content + '</p>');
	},

	commentToggle: function(){
		if(this.$('.comment-editor form').length == 0){
			$('.comment-editor').empty();
			this.$('.comment-editor').html(commentFormTemplate()).hide().fadeIn('slow');
		}else{
			$('.comment-editor').empty();
		}
		return false;
	},

	submitComment: function(){
		var comment = this.$('textarea[name=comment]').val() || '';
		if(comment.length>0){
			var url = this.model.url;
			this.model.url = config.api.host + '/account/statuses/' + this.model.get('_id') + '?type=comment';
			var success = this.model.save({comment: comment},{patch: true});
			if(success){
				this.onCommenAdded({
					accountId: this.account.id,
					username: this.account.username,
					content: comment
				});
				this.$('.comment-editor').html('');
			};
			this.model.url = url;
		}else{
			this.$('textarea[name=comment]').attr('placeholder','没写内容哦');
		}
		return false;
	},

	render: function(){
		var that = this;
		this.$el.html(statusTemplate({model:this.model.toJSON()}));
		var votes = this.model.get('votes') || [];
		var comments = this.model.get('comments') || [];
		votes.forEach(function(vote){
			that.onVoterAdded(vote);
		});
		comments.forEach(function(comment){
			that.onCommenAdded(comment);
		});
		return this;
	}
});