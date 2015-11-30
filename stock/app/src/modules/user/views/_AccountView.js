var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	FormView = require('./__FormView'),
	accountTpl = require('../templates/_entityAccount.tpl'),
	Account = require('../models/Account');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = FormView.extend({

	el: '#accountForm',

	initialize: function(options) {
		var page = $(accountTpl);
		var viewTemplate = $('#viewTemplate', page).html();
		this.template = _.template(_.unescape(viewTemplate || ''));
		this.appEvents = options.appEvents;
		if (options.id == 'me') {
			this.me = true;
		} else {
			this.me = false;
		}
		this.model = new Account();
		this.model.url = this.model.url + '/' + options.id;
		FormView.prototype.initialize.apply(this, options);
	},

	load: function() {
		this.model.fetch({
			xhrFields: {
				withCredentials: true
			},
		});
	},

	events: {
		'change input[name=avatar]': 'uploadAvatar',
		'click .logout': 'logout',
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

	logout: function() {
		this.appEvents.trigger('logout');
		$.ajax({
			url: config.api.host + '/logout',
			type: 'GET',
			xhrFields: {
				withCredentials: true
			},
		}).done(function() {

		}).fail(function() {

		});
		return false;
	},

	//fetch event: done
	done: function(response) {
		this.render();
	},

	render: function() {
		this.$el.html(this.template({
			me: this.me,
			account: this.model.toJSON()
		}));
		return this;
	}
});