var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    statusTemplate = require('../../assets/templates/_itemMessage.tpl'),
    commentFormTemplate = require('../../assets/templates/_formComment1.tpl'),
    MessageUtil = require('./__Util');

Backbone.$ = $;
require('./__ModalView');

exports = module.exports = Backbone.View.extend({

	uiControl: {},

	initialize: function(options){
		this.account = options.account;
		this._convertContent();
		this._transformTime();
		if(this.model.get('fromId') == this.account.id){
			this.uiControl.showToUser = true;
		}else{
			this.uiControl.showToUser = false;
		}
	},
	events: {
		'click .comment-toggle': 'commentToggle',
	},

	_convertContent: function(){
		var type = this.model.get('type');
		var contentObject = this.model.get('content');
		var newContent = MessageUtil.buildContent(type, contentObject);
		this.model.set('content',newContent);
	},

	_transformTime: function(){
		var createtime = this.model.get('lastupdatetime');
		var deltatime = MessageUtil.transformTime(createtime);
		this.model.set('deltatime', deltatime);
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
			this.$('.comment-editor').html(commentFormTemplate()).hide().fadeIn('slow');
		}else{
			this.$('.comment-editor').html('');
		}
		return false;
	},

	render: function(){
		var that = this;
		this.$el.html(statusTemplate({ui: this.uiControl, model:this.model.toJSON()}));
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