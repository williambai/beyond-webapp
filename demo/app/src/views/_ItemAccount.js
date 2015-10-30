var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	accountItemTemplate = require('../templates/_itemAccount.tpl');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	tagName: 'div',

	initialize: function(options) {},

	events: {
		'click .addbutton': 'addFriend',
	},

	addFriend: function() {
		var that = this;
		var $responseArea = this.$('.actionArea');

		$.ajax({
			url: config.api.host + '/friends/account',
			type: 'POST',
			data: {
				fid: that.model.get('_id'),
				username: that.model.get('username'),
				avatar: that.model.get('avatar'),
			},
			xhrFields: {
				withCredentials: true
			},
		}).done(function onSuccess() {
			$.ajax({
				url: config.api.host + '/notifications',
				type: 'POST',
				data: {
					type: 'invite_friend',
					fid: that.model.get('_id'),
				},
				xhrFields: {
					withCredentials: true
				},
			}).done(function(){
				$responseArea.text('已邀请！');
			}).fail(function(){
				$responseArea.text('邀请失败！');
			});
		}).fail(function onError() {
			$responseArea.text('邀请失败！');
		});
		return false;
	},

	render: function() {
		this.$el.html(accountItemTemplate({
			model: this.model.toJSON(),
			addButton: this.addButton,
			removeButton: this.removeButton
		}));
		return this;
	}

});