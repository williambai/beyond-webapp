var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    contactsTemplate = require('../../assets/templates/contacts.tpl'),
    ContactView = require('../../assets/templates/_ItemContact.tpl'),
    ContactCollection = require('../models/ContactCollection');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',
	
	initialize: function(options){
		var contactId = options.id ? options.id: 'me';
		this.collection = new ContactCollection();
		this.collection.url = '/accounts/' + contactId + '/contacts';
		this.collection.on('add', this.contactAdded, this);
		this.collection.on('reset', this.contactCollectionReset, this);
		this.on('load', this.load, this);
	},

	load: function(){
		this.load = true;
		this.render();
		this.collection.fetch();
	},

	contactAdded: function(contact){
		var contactHtml = (new ContactView({model: contact,removeButton:true})).render().el;
		$(contactHtml).appendTo('#contactlist').hide().fadeIn('slow');
	},

	contactCollectionReset: function(collection){
		var that = this;
		collection.each(function(contact){
			that.contactAdded(contact);
		});
	},

	render: function(){
		this.$el.html(contactsTemplate());
		return this;
	}

});