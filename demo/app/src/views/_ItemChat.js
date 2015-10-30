var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    chatItemTemplate = require('../templates/_itemChat.tpl'),
    MessageUtil = require('./__Util');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	tagName: 'div',

	initialize: function(options){
		this._convertContent();
		var createby = this.model.get('createby') || {};
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
		this.$el.html(chatItemTemplate(this.model.toJSON()));
		return this;
	}
});