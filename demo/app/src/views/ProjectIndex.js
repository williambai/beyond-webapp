var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	projectIndexTemplate = require('../templates/projectIndex.tpl'),
	projectBarTemplate = require('../templates/_barProject.tpl'),
	Project = require('../models/Project');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	events: {
		'click .toggle-project': 'closeOrOpen',
	},

	initialize: function(options) {
		this.pid = options.pid;
		this.account = options.account;
		this.model = new Project();
		this.model.url = config.api.host + '/projects/' + options.pid;
		this.model.on('change', this.render, this);
		this.on('load', this.load, this);
	},

	load: function() {
		var that = this;
		this.model.fetch({
			xhrFields: {
				withCredentials: true
			},
			success: function(model) {
				var createby = model.get('createby') || {};
				if (that.account.id == createby.uid) {
					model.set('isOwner', true);
				}
			}
		});
	},

	closeOrOpen: function() {
		var that = this;
		var closed = this.model.get('closed');
		if (closed) {
			if (confirm('你确定要打开项目吗？')) {
				that.model.set('closed', false);
				that.render();
				$.ajax({
					url: config.api.host + '/projects/' + this.model.get('_id') + '/open',
					xhrFields: {
						withCredentials: true
					},
					data: {

					}
				}).done(function() {

				}).fail(function() {

				});
			}
		} else {
			if (confirm('你确定要关闭项目吗？')) {
				that.model.set('closed', true);
				that.render();
				$.ajax({
					url: config.api.host + '/projects/' + this.model.get('_id') + '/close',
					xhrFields: {
						withCredentials: true
					},
					data: {

					}
				}).done(function() {

				}).fail(function() {

				});
			}
		}
		return false;
	},

	render: function() {
		//增加 bottom Bar
		if ($('.navbar-absolute-bottom').length == 0) {
			var bottomBarHtml = projectBarTemplate({
				id: this.pid
			});
			$('.app').prepend('<div class="bottom-bar">' + bottomBarHtml + '</div>');
			if (!$('body').hasClass('has-navbar-bottom')) {
				$('body').addClass('has-navbar-bottom');
			}
		}
		this.$el.html(projectIndexTemplate({
			project: this.model.toJSON(),
			friends_num: this.model.get('friends') ? this.model.get('friends').length : 0
		}));
		return this;
	}
});