var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	FormView = require('./__FormView'),
	accountTpl = require('../templates/_entityMyAccount.tpl'),
	Account = require('../models/MyAccount');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = FormView.extend({

	el: '#accountForm',

	initialize: function(options) {
		this.router = options.router;
		var page = $(accountTpl);
		var viewTemplate = $('#viewTemplate', page).html();
		this.template = _.template(_.unescape(viewTemplate || ''));
		this.appEvents = options.appEvents;
		this.model = new Account({_id: options.id});
		if (options.id == 'me') {
			this.model.set('me',true);
		} else {
			this.model.set('me',false);
		}
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
		'click .logout': 'logout',
	},

	logout: function() {
		var that = this;
		this.appEvents.trigger('logout');
		$.ajax({
			url: config.api.host +'/logout',
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
		this.$el.html(this.template({model: this.model.toJSON()}));
		this.$('img#avatar').attr('src', this.model.get('avatar'));
		return this;
	}
});