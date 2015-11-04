var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	accountItemTemplate = require('../templates/_itemProjectAccount.tpl');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	tagName: 'div',

	initialize: function(options) {
		this.pid = options.pid;
	},

	events: {
		'click .addbutton': 'invite',
	},

	invite: function() {
		var that = this;
		var $responseArea = this.$('.actionArea');

		$.ajax({
			url: config.api.host + '/project/accounts',
			type: 'POST',
			xhrFields: {
				withCredentials: true
			},
			data: {
				pid: that.pid,
				uid: that.model.get('_id'),
				username: that.model.get('username'),
				avatar: that.model.get('avatar'),
			}
		}).done(function() {
			$.ajax({
				url: config.api.host + '/account/notifications',
				type: 'POST',
				xhrFields: {
					withCredentials: true
				},
				data: {
					type: 'invite_join_project',
					uid: that.model.get('_id'),
					project: {
						id: that.pid,
						name: '=====',
					},
				},
			}).done(function() {
				$responseArea.text('已邀请！');
			}).fail(function() {
				$responseArea.text('邀请失败！');
			});
		}).fail(function() {
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