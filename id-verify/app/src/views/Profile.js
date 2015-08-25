var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    profileTemplate = require('../../assets/templates/profile.tpl'),
    Account = require('../models/Account');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	events: {
		'click .logout': 'logout'
	},

	initialize: function(options){
		this.appEvents = options.appEvents;
		this.model = new Account();
		this.model.url = '/accounts/me';
		this.on('load', this.load, this);
		this.model.on('change', this.render, this);
	},

	load: function(){
		this.model.fetch();
	},

	logout: function(){
		this.appEvents.trigger('logout');
		$.get(config.api.host + '/logout');
		return false;
	},

	render: function(){
		this.$el.html(profileTemplate({user: this.model.toJSON()}));
		return this;
	}

});