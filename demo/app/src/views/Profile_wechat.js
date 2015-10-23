var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	loadingTemplate = require('../../assets/templates/loading.tpl'),
	profileTemplate = require('../../assets/templates/profile_wechat.tpl'),
	StatusView = require('./_ItemStatus'),
	Status = require('../models/Status'),
	StatusCollection = require('../models/StatusCollection'),
	Account = require('../models/Account');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loaded: false,

	events: {
		'click .logout': 'logout',
	},

	initialize: function(options) {
		this.appEvents = options.appEvents;
		this.socketEvents = options.socketEvents;
		this.model = new Account();
		this.model.url = '/accounts/' + options.id;
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
		$.ajax({
			url: config.api.host + '/logout',
			type: 'GET',
			xhrFields: {
				withCredentials: true
			},
		}).done(function() {

		}).fail(function() {

		});
		this.appEvents.trigger('logout');
		window.location.hash = 'login';
		return false;
	},

	render: function() {
		if (!this.loaded) {
			this.$el.html(loadingTemplate());
		} else {
			this.$el.html(profileTemplate({
				account: this.model.toJSON()
			}));
		}
		return this;
	}
});