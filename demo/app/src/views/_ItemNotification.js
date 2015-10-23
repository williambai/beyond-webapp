var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	itemTemplate = require('../../assets/templates/_itemNotification.tpl');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	tagName: 'div',

	initialize: function(options) {},

	events: {
		'click button': 'actions',
	},

	actions: function(evt) {
		var that = this;
		var actions = this.model.get('actions');
		var name = $(evt.currentTarget).attr('name');
		var currentAction = _.findWhere(actions, {
			name: name
		});

		var $responseArea = this.$('.actionArea');

		$.ajax({
			url: currentAction.url,
			type: currentAction.method,
			xhrFields: {
				withCredentials: true
			},
			data: {
				fid: this.model.get('createby').uid
			}
		}).done(function onSuccess() {
			$responseArea.text('已处理！');
			$.ajax({
				url: config.api.host + '/notifications/account/me/' + that.model.get('_id'),
				type: 'PUT',
				xhrFields: {
					withCredentials: true
				},
				data: {
					status: {
						code: 1,
						message: '已处理',
					}
				}
			});
		}).fail(function onError() {
			$responseArea.text('处理失败！');
		});
		return false;
	},

	render: function() {
		this.$el.html(itemTemplate({
			model: this.model.toJSON()
		}));
		return this;
	}

});