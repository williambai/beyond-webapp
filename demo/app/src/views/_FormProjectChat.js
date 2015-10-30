var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	menuBarTemplate = require('../templates/_barProject.tpl'),
	chatFormTemplate = require('../templates/_formProjectChat.tpl'),
	FormView = require('./__FormView'),
	ProjectStatus = require('../models/ProjectStatus');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = FormView.extend({

	className: 'bottom-bar',

	initialize: function(options) {
		this.id = options.id;
		this.project = options.project;
		this.account = options.account;
		this.socketEvents = options.socketEvents;
		this.parentView = options.parentView;
	},

	barToggle: true,

	events: {
		'submit form': 'sendText',
		'click .send-file': 'showFileExplorer',
		'change input[name=file]': 'sendFile',
		'click .chat-toggle': 'changeToolbar'
	},

	sendText: function() {
		var that = this;
		var text = $('input[name=chat]').val();
		if (text && /[^\s]+/.test(text)) {
			var projectStatus = new ProjectStatus({
				pid: that.id
			});
			projectStatus.set('type', 'text');
			projectStatus.set('content', {
				body: text
			});
			if (projectStatus.isValid()) {
				var xhr = projectStatus.save(null, {
					xhrFields: {
						withCredentials: true
					},
				});
				if (xhr) {
					xhr
						.success(function(data) {
							if (!!data.code) return console.log(data);
							$('input[name=chat]').val('');

							//update UI
							that.done(new ProjectStatus(data));
							//trigger socket.io
							that.socketEvents.trigger('socket:out:project',{
								to: {
									id: that.id
								},
								content: projectStatus.toJSON(),
							});
						})
						.error(function(xhr) {
							console.log(xhr);
						});
				}
			}

		}
		return false;
	},

	showFileExplorer: function() {
		$('input[name=file]').click();
		return false;
	},

	sendFile: function(evt) {
		var that = this;
		var formData = new FormData();
		formData.append('files', evt.currentTarget.files[0]);
		$.ajax({
			url: config.api.host + '/attachments',
			type: 'POST',
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
			data: formData,
			cache: false, //MUST be false
			processData: false, //MUST be false
			contentType: false, //MUST be false
		}).done(function(data) {
			if (data && data.type) {
				var projectStatus = new ProjectStatus({
					pid: that.id
				});
				projectStatus.set('type', 'image');
				projectStatus.set('content', {
					urls: config.api.host + data.filename,
				});
				// that.socketEvents.trigger('socket:out:project', {
				// 	to: {
				// 		id: that.id
				// 	},
				// 	content: projectStatus.toJSON(),
				// });
				// }
				var xhr = projectStatus.save(null, {
					xhrFields: {
						withCredentials: true
					},
				});
				if (xhr) {
					xhr
						.success(function(data) {
							if (!!data.code) return console.log(data);
							that.done(new ProjectStatus(data));
						})
						.error(function(xhr) {
							console.log(xhr);
						});
				}
			}
			that.$('input[name=file]').val('');
		}).fail(function(err) {
			that.$('input[name=file]').val('');
			console.log(err);
		});
		return false;
	},

	changeToolbar: function() {
		this.barToggle = !this.barToggle;
		if (this.barToggle) {
			window.location.hash = 'project/chat/' + this.id;
		}
		this.render();
		return false;
	},

	render: function() {
		if (this.barToggle) {
			this.$el.html(chatFormTemplate({
				project: this.project.toJSON()
			}));
		} else {
			this.$el.html(menuBarTemplate({
				id: this.id
			}));
		}
		return this;
	}
});