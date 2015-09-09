var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    statusTemplate = require('../../assets/templates/_itemStatus.tpl'),
    commentFormTemplate = require('../../assets/templates/_formComment.tpl'),
    modalTemplate = require('../../assets/templates/_modal.tpl'),
    MessageUtil = require('./__Util');

Backbone.$ = $;

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
		this._transformAvatar();
	},

	_convertContent: function(){
		var contentObject = this.model.get('content');
		var newContent = MessageUtil.convertContent(contentObject);
		this.model.set('content',newContent);
	},

	_transformTime: function(){
		var createtime = this.model.get('createtime');
		var deltatime = MessageUtil.transformTime(createtime);
		this.model.set('deltatime', deltatime);
	},

	_transformAvatar: function(){
		var fromId = this.model.get('fromId');
		var fromUser = this.model.get('fromUser');
		if(fromUser && fromId){
			this.model.set('avatar', fromUser[fromId].avatar);
			this.model.set('username', fromUser[fromId].username);
		}
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

	voteGood: function(){
		var that = this;

		$.ajax({
			url: '/message/account/vote/'+ that.model.get('_id'),
			type: 'POST',
			data: {
					good: 1	
				}
		}).done(function(){
			that.onVoterAdded({
				accountId: that.account.id,
				username: that.account.username
			});
		});
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
		this.$('.comments').append('<p><a href="#profile/'+ comment.accountId +'">'+ comment.username + '</a>: ' + comment.comment + '</p>');
	},

	commentToggle: function(){
		if(this.$('.comment-editor form').length == 0){
			this.$('.comment-editor').html(commentFormTemplate()).hide().fadeIn('slow');
		}else{
			this.$('.comment-editor').html('');
		}
		return false;
	},

	submitComment: function(){
		var comment = this.$('textarea[name=comment]').val() || '';
		if(comment.length>0){
			$.ajax({
				url: '/message/account/comment/' + this.model.get('_id'),
				type: 'POST',
				data: {
					comment: comment
				}
			}).done(function(){

			});
			this.onCommenAdded({
				accountId: this.account.id,
				username: this.account.username,
				comment: comment
			});
			this.$('.comment-editor').html('');
		}else{
			this.$('textarea[name=comment]').attr('placeholder','没写评论哦');
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