var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	loadingTemplate = require('../templates/loading.tpl'),
	profileEditTemplate = require('../templates/profileEdit.tpl'),
	Account = require('../models/Account');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loaded: false,

	initialize: function(options) {
		this.model = new Account();
		this.model.url = '/accounts/me';

		this.model.bind('change', this.render, this);
		this.on('load', this.load, this);
	},

	load: function() {
		this.loaded = true;
		this.model.fetch({
			xhrFields: {
				withCredentials: true
			},
		});
	},

	events: {
		'change input[name=avatar]': 'uploadAvatar',
		'submit form': 'updateProfile',
	},

	uploadAvatar: function(evt) {
		var that = this;
		var formData = new FormData();
		formData.append('files', evt.currentTarget.files[0]);
		$.ajax({
			url: config.api.host + '/accounts/me?type=avatar',
			type: 'PUT',
			xhrFields: {
				withCredentials: true
			},
			data: formData,
			cache: false, //MUST be false
			processData: false, //MUST be false
			contentType: false, //MUST be false
		}).done(function(data) {
			that.model.set('avatar', data);
		}).fail(function(err) {
			console.log(err);
		});
		return false;
	},

	updateProfile: function() {
		$.ajax({
			url: config.api.host + '/accounts/me',
			type: 'POST',
			xhrFields: {
				withCredentials: true
			},
			data: {
				username: this.$('input[name=username]').val(),
				realname: this.$('input[name=realname]').val(),
				biography: this.$('textarea[name=biography]').val(),
			},
		}).done(function() {
			window.location.hash = 'profile/me';
		}).fail(function failure(err) {
			console.log(err);
		});
		return false;
	},

	render: function() {
		if (!this.loaded) {
			this.$el.html(loadingTemplate());
		} else {
			this.$el.html(profileEditTemplate(this.model.toJSON()));
		}
		return this;
	}
});