var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    ListView = require('./__ListView'),
    feedbackTpl = require('../templates/_entityFeedback.tpl'),
    FeedbackCollection = require('../models/FeedbackCollection');

Backbone.$ = $;
var config = require('../conf');
var MessageUtil = require('./__Util');

exports = module.exports = ListView.extend({
	el: '#list',

	initialize: function(options){
		var page = $(feedbackTpl);
		var itemTemplate = $('#itemTemplate', page).html();
		this.template = _.template(_.unescape(itemTemplate || ''));
		var commentTpl = $('#commentTemplate', page).html();
		this.commentTemplate = _.template(_.unescape(commentTpl) || '');
		this.collection = new FeedbackCollection();
		ListView.prototype.initialize.apply(this,options);
	},

	getNewItemView: function(model){
		var that = this;
		this._convertContent(model);
		this._transformTime(model);
		var item = this.template({model: model.toJSON()});
		var $item = $(item);
		$item.find('img.avatar').attr('src', model.get('avatar'));
		var votes = model.get('votes') || [];
		var comments = model.get('comments') || [];
		votes.forEach(function(vote){
			if($item.find('.has-good').length == 0){
				$item.find('.comments').before(that.templateGood);
			}
			$item.find('.user-list').append('&nbsp;<a href="#profile/'+ voter.accountId +'">'+ voter.username +'</a>;');
		});
		comments.forEach(function(comment){
			$item.find('.comments').append('<p><a href="#profile/'+ comment.uid +'">'+ comment.username + '</a>: ' + comment.content + '</p>');
		});
		return $item.html();
	},

	events: {
		'click .good': 'voteGood',
		'click .comment-toggle': 'commentToggle',
		'submit form': 'submitComment',
		'click .expand': 'expand',
		'click .packup': 'packup',

		'click .media-body img': 'showInModal',
	},

	_convertContent: function(model){
		var type = model.get('type');
		var contentObject = model.get('content');
		var newContent = MessageUtil.buildContent(type, contentObject);
		model.set('content',newContent);
	},

	_transformTime: function(model){
		var createtime = model.get('lastupdatetime');
		var deltatime = MessageUtil.transformTime(createtime);
		model.set('deltatime', deltatime);
	},


	commentToggle: function(evt){
		var $item = this.$(evt.currentTarget).closest('.media');
		var id = $item.attr('id');
		if($item.find('.comment-editor form').length == 0){
			this.$('.comment-editor').empty();
			$item.find('.comment-editor').html(this.commentTemplate()).hide().fadeIn('slow');
		}else{
			$item.find('.comment-editor').empty();
		}
		return false;
	},

	submitComment: function(evt){
		var that = this;
		var $item = this.$(evt.currentTarget).closest('.media');
		var id = $item.attr('id');
		var comment = this.$('textarea[name=comment]').val() || '';
		if(comment.length>0){
			$.ajax({
				url: config.api.host + '/platform/feedbacks/' + id + '?action=comment',
				type: 'PUT',
				data: {
					content: comment,
				},
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
			}).done(function(data) {
				$item.find('.comments').append('<p><a href="#profile/'+ data.uid +'">'+ data.username + '</a>: ' + comment + '</p>');
				$item.find('.comment-editor').html('');
			});
		}else{
			$item.find('textarea[name=comment]').attr('placeholder','没写内容哦');
		}
		return false;
	},


});
