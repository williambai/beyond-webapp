var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    chatItemTemplate = require('../../assets/templates/_itemChat.tpl'),
    chatItemImageTemplate = require('../../assets/templates/_itemChatImage.tpl'),
    MessageUtil = require('./__Util');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	tagName: 'div',

	initialize: function(options){
		this._convertContent();
		var createby = this.model.get('createby');
		if(options.account.id == createby.uid){
			this.model.set('from', 'me');
		}
	},
	
	_convertContent: function(){
		var type = this.model.get('type');
		var contentObject = this.model.get('content');
		var newContent = MessageUtil.buildContent(type, contentObject);
		this.model.set('content',newContent);
	},

	render: function(){
		var type = this.model.get('type');
		if(type =='text'){
			this.$el.addClass('textType');
			this.$el.html(chatItemTemplate(this.model.toJSON()));
		}else if(type == 'image'){
			this.$el.addClass('imageType');
			this.$el.html(chatItemImageTemplate(this.model.toJSON()));
		}
		return this;
	}
});