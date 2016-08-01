var _ = require('underscore');
var $ = require('jquery');
var	Backbone = require('backbone');
var config = require('../../conf');
var ListView = require('../../_base/__ListView');
var MessageUtil = require('../../_base/__Util');

Backbone.$ = $;

//** 模型
var Feedback = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/private/feedbacks',	
	
	defaults: {
	},
	
	// validation: {
	// 	'name': {
	// 		required: true,
	// 		msg: '请输入客户姓名'
	// 	}
	// },	
});

//** 集合
var FeedbackCollection = Backbone.Collection.extend({
	url: config.api.host + '/private/feedbacks',
	model: Feedback,
});

//** List子视图
var FeedbackListView = ListView.extend({
	el: '#list',
	template: _.template($('#tpl-feedback-item').html()),
	commentTemplate: _.template($('#tpl-feedback-comment').html()),

	initialize: function(options){
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
				url: config.api.host + '/private/feedbacks/' + id + '?action=comment',
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

//** 主视图
exports = module.exports = Backbone.View.extend({

	el: '#content',
	template: _.template($('#tpl-feedback-index').html()),

	initialize: function(options) {
		this.router = options.router;
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .add': 'addFeedback',
		// 'click .edit': 'editFeedback',
		'click .delete': 'removeFeedback',
	},

	load: function() {
		var that = this;
		this.render();
		this.listView = new FeedbackListView({
			el: '#list',
		});
		this.listView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
		return false;
	},

	addFeedback: function(){
		this.router.navigate('feedback/add',{trigger: true});
		return false;
	},

	// editFeedback: function(evt){
	//	var id = this.$(evt.currentTarget).closest('.media').attr('id');
	// 	this.router.navigate('feedback/edit/'+ id,{trigger: true});
	// 	return false;
	// },

	removeFeedback: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).closest('.media').attr('id');
			var model = new Feedback({_id: id});
			model.destroy({wait: true});
			this.listView.trigger('refresh');
		}
		return false;
	},

	render: function() {
		this.$el.html(this.template());
		return this;
	},
});