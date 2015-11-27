var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	loadingTemplate = _.template(require('../templates/__loading.tpl')),
	profileTemplate = _.template(require('../templates/profile.tpl')),
	Account = require('../models/Account');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loaded: false,

	events: {
		'click .logout': 'logout',
	},

	initialize: function(options) {
		this.appEvents = options.appEvents;
		if (options.id == 'me') {
			this.me = true;
		} else {
			this.me = false;
		}
		this.model = new Account();
		this.model.url = config.api.host + '/accounts/' + options.id;
		this.model.on('change', this.render, this);
		this.on('load', this.load, this);
	},

	load: function() {
		this.loaded = true;
		this.render();
		this.model.fetch({
			xhrFields: {
				withCredentials: true
			},
		});
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

	render: function() {
		if (!this.loaded) {
			this.$el.html(loadingTemplate());
		} else {
			this.$el.html(profileTemplate({
				me: this.me,
				account: this.model.toJSON()
			}));
		}
		return this;
	}
});