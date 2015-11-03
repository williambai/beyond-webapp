var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	loadingTemplate = require('../templates/loading.tpl'),
	profileTemplate = require('../templates/profile.tpl'),
	StatusView = require('./_ItemStatus'),
	Status = require('../models/Status'),
	StatusCollection = require('../models/StatusCollection'),
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
		this.socketEvents = options.socketEvents;
		this.model = new Account();
		this.model.url = config.api.host + '/accounts/' + options.id;

		this.statusCollection = new StatusCollection();
		this.statusCollection.url = config.api.host + '/account/messages/' + options.id + '?type=status';

		this.model.on('change', this.render, this);
		this.statusCollection.on('add', this.onStatusAdded, this);
		this.statusCollection.on('reset', this.onStatusCollectionReset, this);
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
		this.statusCollection.fetch({
			xhrFields: {
				withCredentials: true
			},
		});
	},

	logout: function() {
		this.appEvents.trigger('logout');
		this.socketEvents.trigger('app:logout');
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

	onStatusAdded: function(statusModel) {
		var statusHtml = (new StatusView({
			model: statusModel
		})).render().el;
		$(statusHtml).prependTo('.status-list').hide().fadeIn('slow');
	},

	onSocketStatusAdded: function(data) {
		var newStatus = data.data;
		this.onStatusAdded(new Status({
			status: newStatus.status,
			name: newStatus.name
		}));
	},

	render: function() {
		if (!this.loaded) {
			this.$el.html(loadingTemplate());
		} else {
			// if(this.model.get('_id')){
			// 	this.socketEvents.bind('status' + this.model.get('_id'), this.onSocketonStatusAdded, this);
			// }
			this.$el.html(profileTemplate({
				me: this.me,
				account: this.model.toJSON()
			}));
			// var that = this;
			// var statusCollection = this.model.get('status');
			// if(null != statusCollection){
			// 	_.each(statusCollection,function(statusJson){
			// 		var statusModel = new Status(statusJson);
			// 		that.onStatusAdded(statusModel);
			// 	});
			// }
		}
		return this;
	}
});