var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    addContactTemplate = require('../../assets/templates/contactAdd.tpl'),
    ContactView = require('../../assets/templates/_ItemContact.tpl'),
    Contact = require('../models/Contact');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	initialize: function(options){
		this.account = options.account;
	},

	events: {
		'submit form': 'search'
	},

	search: function(){
		var emailDomain = this.account.email.substr(this.account.email.indexOf('@'));
		var that = this;
		$.post('/contacts/find',{
				searchStr: $('input[name=searchStr]').val() + emailDomain,
			},function onSucess(data){
				that.render(data);
			}).error(function(){
				$('#results').text('没有找到。');
				$('#results').slidedown();
			});
		return false;
	},

	render: function(resultList){
		this.$el.html(addContactTemplate({account: this.account}));
		if(null != resultList){
			_.each(resultList, function(contactJson){
				var contact = new Contact(contactJson);
				var contactHtml = (new ContactView({model: contact,addButton: true})).render().el;
				$('#results').append(contactHtml);
			});
		}
		return this;
	}
});