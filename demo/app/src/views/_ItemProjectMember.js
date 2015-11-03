var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	itemTemplate = require('../templates/_itemProjectMember.tpl');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	tagName: 'div',

	events: {
		'click .removebutton': 'remove'
	},

	initialize: function(options) {
		this.project = options.project;
	},

	remove: function() {
		if (confirm('确认移除' + this.model.get('username') + '用户吗？')) {
			var $responseArea = this.$('.actionArea');
			$responseArea.text('正在移除....');
			$.ajax({
				url: config.api.host + '/project/accounts/' + this.model.get('_id'),
				type: 'DELETE',
				xhrFields: {
					withCredentials: true
				},
				// data: {
				// }
			}).done(function() {
				$responseArea.text('移除成功！')
			}).fail(function() {
				$responseArea.text('移除失败');
			});
			return false;
		}
	},


	render: function() {
		this.$el.html(itemTemplate({
			project: this.project.toJSON(),
			model: this.model.toJSON(),
		}));
		return this;
	}

});