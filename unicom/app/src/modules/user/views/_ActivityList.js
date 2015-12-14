var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    ListView = require('./__ListView'),
    activityTpl = require('../templates/_entityActivity.tpl'),
    AccountActivityCollection = require('../models/AccountActivityCollection');

Backbone.$ = $;
	
var Utils = require('./__Util');

exports = module.exports = ListView.extend({
	el: '#list',

	initialize: function(options){
		var page = $(activityTpl);
		var itemTemplate = $('#itemTemplate', page).html();
		this.template = _.template(_.unescape(itemTemplate || ''));
		this.collection = new AccountActivityCollection();
		ListView.prototype.initialize.apply(this,options);
	},
	getNewItemView: function(model){
		this._convertContent(model);
		this._transformTime(model);
		var item = '<div>' + this.template({model: model.toJSON()}) + '</div>';
		var $item = $(item);
		$item.find('img').attr('src', model.get('avatar'));
		return $item.html();
	},

	_convertContent: function(model){
		var type = model.get('type');
		var contentObject = model.get('content');
		var newContent = Utils.buildContent(type, contentObject);
		model.set('content',newContent);
	},

	_transformTime: function(model){
		var createtime = model.get('lastupdatetime');
		var deltatime = Utils.transformTime(createtime);
		model.set('deltatime', deltatime);
	},
});
