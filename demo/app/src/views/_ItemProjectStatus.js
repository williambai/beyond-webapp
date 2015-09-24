var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    statusTemplate = require('../../assets/templates/_itemProjectStatus.tpl'),
    modalTemplate = require('../../assets/templates/_modal.tpl'),
    MessageUtil = require('./__Util');

Backbone.$ = $;
require('./__ModalView');

exports = module.exports = Backbone.View.extend({

	// tagName: 'li',
	templateExpand: '<a class="expand"><p>展开</p></a>',
	templatePackup: '<a class="packup"><p>收起</p></a>',

	events: {
		'click .good': 'voteGood',
		'click .bad': 'voteBad',
		'click .level': 'changeLevel',
		'click .expand': 'expand',
		'click .packup': 'packup',
		'click .media-body img': 'showInModal',
	},

	initialize: function(){
		this._convertContent();
		this._transformTime();
		this._transformAvatar();
	},

	_convertContent: function(){
		var type = this.model.get('type');
		var contentObject = this.model.get('content');
		var newContent = MessageUtil.buildContent(type, contentObject);
		// var newContent = MessageUtil.convertContent(contentObject);
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
			url: '/messages/project/'+ that.model.get('_id') + '?type=vote',
			type: 'PUT',
			data: {
					good: 1	
				}
		}).done(function(){
		});
		return false;
	},

	voteBad: function(){
		var that = this;

		$.ajax({
			url: '/messages/project/'+ that.model.get('_id') + '?type=vote',
			type: 'PUT',
			data: {
					bad: 1	
				}
		}).done(function(){
		});
		return false;
	},

	render: function(){
		this.$el.html(statusTemplate({model:this.model.toJSON()}));
		return this;
	}
});