var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	friendItemTemplate = require('../templates/_itemFriend.tpl');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	tagName: 'div',


	initialize: function(options) {},

	events: {
		'click .removebutton': 'removeFriend'
	},

	removeFriend: function() {
		if (confirm('确认移除' + this.model.get('username') + '用户吗？')) {
			var $responseArea = this.$('.actionArea');
			$responseArea.text('正在移除....');
			$.ajax({
				url: config.api.host + '/account/friends/' + this.model.get('fid'),
				type: 'DELETE',
				xhrFields: {
					withCredentials: true
				},
			}).done(function onSuccess() {
				$responseArea.text('移除成功！')
			}).fail(function onError() {
				$responseArea.text('移除失败');
			});
			return false;
		}
	},

	render: function() {
		this.$el.html(friendItemTemplate({
			model: this.model.toJSON()
		}));
		return this;
	}

});