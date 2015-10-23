var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	projectIndexTemplate = require('../../assets/templates/projectIndex_wechat.tpl'),
	ProjectCheckInView = require('./ProjectCheckIn_wechat'),
	Project = require('../models/Project');
var config = require('../config');
Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	initialize: function(options) {
		this.pid = options.pid;
		this.originid = options.originid;
		this.model = new Project();
		this.model.url = '/projects/' + options.pid;
		this.model.on('change', this.render, this);
		this.on('load', this.load, this);
	},

	events: {
		'click .checkin': 'checkIn',
	},

	load: function() {
		this.model.fetch({
			xhrFields: {
				withCredentials: true
			},
		});
	},

	checkIn: function() {
		var that = this;
		$.ajax({
			url: config.api.host + '/wechat/project/update?originid=' + this.originid + '&pid=' + that.model.get('_id') + '&pname=' + that.model.get('name'),
			type: 'GET',
			xhrFields: {
				withCredentials: true
			},
		}).done(function(data) {
			var projectCheckInView = new ProjectCheckInView({
				model: that.model
			});
			projectCheckInView.render();
		}).fail(function() {
			window.location.reload();
		});
		return false;
	},

	render: function() {
		this.$el.html(projectIndexTemplate({
			project: this.model.toJSON(),
			friends_num: this.model.get('friends') ? this.model.get('friends').length : 0
		}));
		return this;
	}
});