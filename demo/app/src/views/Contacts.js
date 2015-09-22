var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    contactsTemplate = require('../../assets/templates/contacts.tpl'),
    ContactListView = require('./_ListContact'),
    ContactCollection = require('../models/ContactCollection');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',
	
	initialize: function(options){
		this.accountId = options.id;
		this.on('load', this.load, this);
	},

	load: function(){
		this.load = true;
		var url = '/friends/account/' + this.accountId;
		var contactListView = new ContactListView({url: url});
		contactListView.trigger('load');
	},

	render: function(){
		this.$el.html(contactsTemplate());
		return this;
	}

});