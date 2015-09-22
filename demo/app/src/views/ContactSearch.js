var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    addContactTemplate = require('../../assets/templates/contactAdd.tpl'),
    ContactListView = require('./_ListContact');

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
		var url = '/accounts?type=search' + 
				'&searchStr=' + 
				$('input[name=searchStr]').val() + emailDomain;
		var contactListView = new ContactListView({url: url});
		contactListView.trigger('load');
		return false;
	},

	render: function(){
		this.$el.html(addContactTemplate({account: this.account}));
		return this;
	}
});